import * as React from 'react';
import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LogOutButton } from '@/components/onboarding/log-out-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { dedupedAuth } from '@/lib/auth';
import { getLoginRedirect } from '@/lib/auth/redirect';
import { checkSession } from '@/lib/auth/session';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Onboarding')
};

export default async function OnboardingLayout({
  children
}: React.PropsWithChildren): Promise<React.JSX.Element> {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getLoginRedirect());
  }
  return (
    <div className="relative">
      <LogOutButton className="fixed bottom-2 left-2 hidden sm:flex" />
      {children}
      <ThemeToggle className="fixed bottom-2 right-2 rounded-full" />
    </div>
  );
}
