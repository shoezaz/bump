import * as React from 'react';
import { type Metadata } from 'next';

import { VerifyEmailExpiredCard } from '@/components/auth/verify-email/verify-email-expired-card';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

type SearchParams = {
  email?: string;
};

export const metadata: Metadata = {
  title: createTitle('Email Verification Expired')
};

export default function VerifyEmailExpiredPage(
  props: NextPageProps & { searchParams: SearchParams }
): React.JSX.Element {
  const email = props.searchParams.email ?? '';
  return (
    <div className="w-full min-w-[360px] px-2">
      <VerifyEmailExpiredCard
        className="mx-auto max-w-sm"
        email={email}
      />
    </div>
  );
}
