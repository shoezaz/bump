import * as React from 'react';
import { type Metadata } from 'next';

import { AuthContainer } from '@/components/auth/auth-container';
import { VerifyEmailCard } from '@/components/auth/verify-email/verify-email-card';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

export const metadata: Metadata = {
  title: createTitle('Verify Email')
};

export default function VerifyEmailPage(
  props: NextPageProps
): React.JSX.Element {
  const email = (props.searchParams.email as string) ?? '';
  return (
    <AuthContainer maxWidth="sm">
      <VerifyEmailCard email={email} />
    </AuthContainer>
  );
}
