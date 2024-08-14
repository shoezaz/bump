import * as React from 'react';
import { type Metadata } from 'next';

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
    <div className="w-full min-w-[360px] px-2">
      <VerifyEmailCard
        className="mx-auto max-w-sm"
        email={email}
      />
    </div>
  );
}
