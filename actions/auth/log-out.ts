'use server';

import { actionClient } from '@/actions/safe-action';
import { Routes } from '@/constants/routes';
import { signOut } from '@/lib/auth';

export const logOut = actionClient
  .metadata({ actionName: 'logOut' })
  .action(async () => {
    return await signOut({
      redirect: true,
      redirectTo: Routes.Logout
    });
  });
