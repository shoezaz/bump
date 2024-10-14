'use server';

import { actionClient } from '@/actions/safe-action';
import { Routes } from '@/constants/routes';
import { signOut } from '@/lib/auth';
import { logOutSchema } from '@/schemas/auth/log-out-schema';

export const logOut = actionClient
  .metadata({ actionName: 'logOut' })
  .schema(logOutSchema)
  .action(async ({ parsedInput }) => {
    if (parsedInput.redirect) {
      return await signOut({
        redirect: true,
        redirectTo: Routes.Logout
      });
    }

    return await signOut({ redirect: false });
  });
