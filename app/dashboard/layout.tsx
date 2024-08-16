import * as React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { MobileSheet } from '@/components/dashboard/mobile-sheet';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Routes } from '@/constants/routes';
import { getProfile } from '@/data/account/get-profile';
import { getFavorites } from '@/data/favorites/get-favorites';
import { dedupedAuth } from '@/lib/auth';
import { getLoginRedirect } from '@/lib/auth/redirect';
import { checkSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Dashboard')
};

export default async function DashboardLayout({
  children
}: React.PropsWithChildren): Promise<React.JSX.Element> {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getLoginRedirect());
  }

  const userFromDb = await prisma.user.findFirst({
    where: { id: session.user.id },
    select: {
      completedOnboarding: true,
      organization: {
        select: {
          completedOnboarding: true
        }
      }
    }
  });
  if (
    userFromDb &&
    (!userFromDb.completedOnboarding ||
      !userFromDb.organization?.completedOnboarding)
  ) {
    return redirect(Routes.Onboarding);
  }

  const [favorites, profile] = await Promise.all([
    getFavorites(),
    getProfile()
  ]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        favorites={favorites}
        profile={profile}
      />
      <main
        id="skip"
        className="size-full max-w-[calc(100vw-var(--sidebar-width))]"
      >
        <MobileSheet
          favorites={favorites}
          profile={profile}
        />
        {children}
      </main>
    </div>
  );
}
