import * as React from 'react';
import { type Metadata } from 'next';

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
    <div className="w-full min-w-[360px] px-2">
      <ForgotPasswordSuccessCard
        className="mx-auto max-w-sm"
        email={email}
      />
    </div>
  );
}
