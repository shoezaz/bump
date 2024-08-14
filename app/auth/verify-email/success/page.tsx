import * as React from 'react';
import { type Metadata } from 'next';

import { VerifyEmailSuccessCard } from '@/components/auth/verify-email/verify-email-success-card';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Email Verification Success')
};

export default async function EmailVerificationSuccessPage(): Promise<React.JSX.Element> {
  return (
    <div className="w-full min-w-[360px]">
      <VerifyEmailSuccessCard className="mx-auto max-w-sm" />
    </div>
  );
}
