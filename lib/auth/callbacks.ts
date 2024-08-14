import { cookies } from 'next/headers';
import type { NextAuthConfig } from 'next-auth';

import { Routes } from '@/constants/routes';
import { adapter } from '@/lib/auth/adapter';
import { AuthCookies } from '@/lib/auth/cookies';
import { AuthErrorCode } from '@/lib/auth/errors';
import {
  generateSessionToken,
  getSessionExpiryFromNow
} from '@/lib/auth/session';
import { OAuthIdentityProvider } from '@/types/identity-provider';

export const callbacks = {
  async signIn({ user, account, profile }): Promise<string | boolean> {
    if (!account) {
      return false;
    }

    // Credentials Provider
    if (account.type === 'credentials') {
      if (!user || !user.id) {
        return false;
      }

      const sessionToken = generateSessionToken();
      const sessionExpiry = getSessionExpiryFromNow();

      const createdSession = await adapter.createSession!({
        sessionToken: sessionToken,
        userId: user.id,
        expires: sessionExpiry
      });

      if (!createdSession) {
        return false;
      }

      cookies().set({
        name: AuthCookies.SessionToken,
        value: sessionToken,
        expires: sessionExpiry
      });

      // already checked in CredentialsProvder.authorize()
      return true;
    }

    // OAuth Providers
    if (!account.provider || !profile) {
      return false;
    }

    if (
      !Object.values(OAuthIdentityProvider).includes(
        account.provider.toLowerCase() as OAuthIdentityProvider
      )
    ) {
      return `${Routes.AuthError}?error=${AuthErrorCode.IllegalOAuthProvider}`;
    }

    if (account.provider === OAuthIdentityProvider.Google) {
      if (!profile.email_verified) {
        return `${Routes.AuthError}?error=${AuthErrorCode.UnverifiedEmail}`;
      }
    }

    if (account.provider === OAuthIdentityProvider.MicrosoftEntraId) {
      // Microsoft does not provide a verified email field
      // If you want to have verified emails, the suggestion is to use the user here, e.g.
      //
      // if (!user.emailVerified || isBefore(new Date(), user.emailVerified)) {
      //    /* send verification email */
      //    return `${Routes.VerifyEmail}?email=${encodeURIComponent(parsedInput.email)}`
      // }
    }

    if (user?.name) {
      user.name = user.name.substring(0, 64);
    }
    if (profile.name) {
      profile.name = profile.name.substring(0, 64);
    }

    return true;
  },
  async jwt({ token, trigger, account, user }) {
    if ((trigger === 'signIn' || trigger === 'signUp') && account) {
      token.accessToken = account.access_token;

      if (account.provider === 'credentials' && user.id) {
        const expires = getSessionExpiryFromNow();
        const sessionToken = generateSessionToken();

        const session = await adapter.createSession!({
          userId: user.id,
          sessionToken,
          expires
        });

        token.sessionId = session.sessionToken;
      }
    }

    // Let's not allow the client to indirectly update the token using useSession().update()
    if (trigger === 'update') {
      return token;
    }

    return token;
  },
  async session({ trigger, session, user }) {
    if (session && user) {
      session.user.organizationId = user.organizationId;
      session.user.id = user.id;
    }

    // Let's not allow the client to update the session using useSession().update()
    if (trigger === 'update') {
      return session;
    }

    return session;
  }
} satisfies NextAuthConfig['callbacks'];
