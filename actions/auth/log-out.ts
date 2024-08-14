'use server';

import { redirect } from 'next/navigation';

import { actionClient } from '@/actions/safe-action';
import { Routes } from '@/constants/routes';
import { signOut } from '@/lib/auth';

export const logOut = actionClient
  .metadata({ actionName: 'logOut' })
  .action(async () => {
    await signOut();
    return redirect(Routes.Login);
  });
