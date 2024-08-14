import * as React from 'react';
import { type Metadata } from 'next';

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
    <div className="w-full min-w-[360px] px-2">
      <AuthErrorCard
        className="mx-auto max-w-sm"
        errorMessage={errorMessage}
      />
    </div>
  );
}
