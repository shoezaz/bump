import * as React from 'react';
import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';
import { Routes } from '@/constants/routes';
import { getOnboardingData } from '@/data/onboarding/get-onboarding-data';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Onboarding')
};

export default async function OnboardingPage(): Promise<React.JSX.Element> {
  const { user, organization } = await getOnboardingData();
  if (user.completedOnboarding && organization.completedOnboarding) {
    return redirect(Routes.Home);
  }
  return (
    <OnboardingWizard
      user={user}
      organization={organization}
    />
  );
}
