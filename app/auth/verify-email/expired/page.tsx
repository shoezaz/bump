import * as React from 'react';
import { type Metadata } from 'next';

import { AuthContainer } from '@/components/auth/auth-logo';
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
    <AuthContainer maxWidth="sm">
      <VerifyEmailExpiredCard email={email} />
    </AuthContainer>
  );
}
