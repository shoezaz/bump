import * as React from 'react';
import { type Metadata } from 'next';

import { AuthContainer } from '@/components/auth/auth-container';
import { RecoveryCodeCard } from '@/components/auth/recovery-code/recovery-code-card';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

type SearchParams = {
  token?: string;
  expiry?: string;
};

export const metadata: Metadata = {
  title: createTitle('Recovery code')
};

export default async function RecoveryCodePage(
  props: NextPageProps & { searchParams: SearchParams }
): Promise<React.JSX.Element> {
  if (!props.searchParams.token) {
    return <AuthContainer>Missing token param.</AuthContainer>;
  }
  if (!props.searchParams.expiry) {
    return <AuthContainer>Missing expiry param.</AuthContainer>;
  }

  return (
    <AuthContainer maxWidth="sm">
      <RecoveryCodeCard
        token={props.searchParams.token}
        expiry={props.searchParams.expiry}
      />
    </AuthContainer>
  );
}
