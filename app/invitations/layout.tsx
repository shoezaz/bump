import * as React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Routes } from '@/constants/routes';
import { dedupedAuth } from '@/lib/auth';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Invitations')
};

export default async function InvitationsLayout({
  children
}: React.PropsWithChildren): Promise<React.JSX.Element> {
  const session = await dedupedAuth();
  if (session) {
    return redirect(Routes.Home);
  }

  return (
    <div className="py-8">
      <main className="flex flex-col items-center justify-center p-2">
        {children}
      </main>
      <ThemeToggle className="fixed bottom-2 right-2 rounded-full" />
    </div>
  );
}
