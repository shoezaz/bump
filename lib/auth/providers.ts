import { isBefore } from 'date-fns';
import { type NextAuthConfig, type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import MicrosoftEntraIdProvider from 'next-auth/providers/microsoft-entra-id';

import { verifyPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/db/prisma';
import { rateLimit } from '@/lib/network/rate-limit';
import {
  IncorrectEmailOrPasswordError,
  InternalServerError,
  RateLimitExceededError,
  UnverifiedEmailError
} from '@/lib/validation/exceptions';
import { logInSchema } from '@/schemas/auth/log-in-schema';
import { IdentityProvider } from '@/types/identity-provider';

export const providers = [
  CredentialsProvider({
    id: IdentityProvider.Credentials,
    name: IdentityProvider.Credentials,
    credentials: {
      email: { label: 'Email', type: 'text' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials) {
        console.error(`For some reason credentials are missing`);
        throw new InternalServerError();
      }

      if (!credentials.email || !credentials.password) {
        throw new IncorrectEmailOrPasswordError();
      }

      const result = logInSchema.safeParse(credentials);
      if (!result.success) {
        throw new IncorrectEmailOrPasswordError();
      }
      const parsedCredentials = result.data;

      const normalizedEmail = parsedCredentials.email.toLowerCase();
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: {
          id: true,
          organizationId: true,
          password: true,
          email: true,
          emailVerified: true,
          name: true
        }
      });

      if (!user || !user.password || !user.email) {
        throw new IncorrectEmailOrPasswordError();
      }

      const isCorrectPassword = await verifyPassword(
        parsedCredentials.password,
        user.password
      );
      if (!isCorrectPassword) {
        throw new IncorrectEmailOrPasswordError();
      }

      if (!user.emailVerified || isBefore(new Date(), user.emailVerified)) {
        throw new UnverifiedEmailError();
      }

      try {
        const limiter = rateLimit({
          intervalInMs: 60 * 1000 // 1 minute
        });
        limiter.check(10, user.email); // 10 requests per minute
      } catch {
        throw new RateLimitExceededError();
      }

      return {
        id: user.id,
        organizationId: user.organizationId,
        email: user.email,
        name: user.name
      };
    }
  }),
  GoogleProvider({
    id: IdentityProvider.Google,
    name: IdentityProvider.Google,
    clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
    allowDangerousEmailAccountLinking: true,
    authorization: {
      params: {
        scope: 'openid email profile',
        prompt: 'consent',
        access_type: 'offline',
        response_type: 'code'
      }
    }
  }),
  MicrosoftEntraIdProvider({
    id: IdentityProvider.MicrosoftEntraId,
    name: IdentityProvider.MicrosoftEntraId,
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID as string,
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET as string,
    tenantId: 'common',
    allowDangerousEmailAccountLinking: true,
    token: {
      url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    },
    authorization: {
      url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      params: {
        scope: 'openid profile email offline_access User.Read'
      }
    },
    userinfo: { url: 'https://graph.microsoft.com/oidc/userinfo' },
    issuer: 'https://login.microsoftonline.com/common/v2.0',
    profile(profile) {
      // Removed the image fetching logic here, since it is unnecessary.
      // We really only want to fetch the image once during Events.signIn({ isNewUser })
      // and copy the image into our database.
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email
      } as User;
    }
  })
] satisfies NextAuthConfig['providers'];
