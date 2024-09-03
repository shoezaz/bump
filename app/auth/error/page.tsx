import * as React from 'react';
import { type Metadata } from 'next';

import { AuthContainer } from '@/components/auth/auth-logo';
import { AuthErrorCard } from '@/components/auth/error/auth-error-card';
import { AuthErrorCode, authErrorMessages } from '@/lib/auth/errors';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

export const metadata: Metadata = {
  title: createTitle('Auth Error')
};

export default function AuthErrorPage(props: NextPageProps): React.JSX.Element {
  const error = props.searchParams.error as string;
  const errorMessage =
    error in authErrorMessages
      ? authErrorMessages[error as AuthErrorCode]
      : authErrorMessages[AuthErrorCode.UnknownError];
  return (
    <AuthContainer maxWidth="sm">
      <AuthErrorCard errorMessage={errorMessage} />
    </AuthContainer>
  );
}
