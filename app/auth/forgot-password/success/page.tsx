import * as React from 'react';
import { type Metadata } from 'next';

import { AuthContainer } from '@/components/auth/auth-container';
import { ForgotPasswordSuccessCard } from '@/components/auth/forgot-password/forgot-password-success-card';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

export const metadata: Metadata = {
  title: createTitle('Reset link sent')
};

export default function ForgotPasswordSuccessPage(
  props: NextPageProps
): React.JSX.Element {
  const email = (props.searchParams.email as string) ?? '';
  return (
    <AuthContainer maxWidth="sm">
      <ForgotPasswordSuccessCard email={email} />
    </AuthContainer>
  );
}
