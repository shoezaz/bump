'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CredentialsSignin } from 'next-auth';
import { returnValidationErrors } from 'next-safe-action';

import { actionClient } from '@/actions/safe-action';
import { Routes } from '@/constants/routes';
import { signIn } from '@/lib/auth';
import { AuthCookies } from '@/lib/auth/cookies';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import { passThroughlogInSchema } from '@/schemas/auth/log-in-schema';
import { IdentityProvider } from '@/types/identity-provider';

export const logIn = actionClient
  .metadata({ actionName: 'login' })
  .schema(passThroughlogInSchema)
  .action(async ({ parsedInput }) => {
    // Get the callbackUrl before calling signIn, because signIn will overwrite the cookie.
    const callbackUrl = cookies().get(AuthCookies.CallbackUrl)?.value;

    // Expected UX for logins is to pass the login credentials through
    // and not validate them on the client-side.
    try {
      await signIn(IdentityProvider.Credentials, {
        ...parsedInput,
        redirect: false
      });
    } catch (e) {
      if (e instanceof CredentialsSignin) {
        return returnValidationErrors(passThroughlogInSchema, {
          _errors: [e.code]
        });
      }
    }

    // To avoid redirect vulnerabilities from client-originated URLs,
    // always check if they have the correct origin.
    if (
      callbackUrl &&
      new URL(callbackUrl).origin === new URL(getBaseUrl()).origin
    ) {
      return redirect(callbackUrl);
    } else {
      return redirect(Routes.Home);
    }
  });
