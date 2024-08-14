import * as React from 'react';
import { type Metadata } from 'next';

import { LoginCard } from '@/components/auth/login/login-card';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Log in')
};

export default async function LoginPage(): Promise<React.JSX.Element> {
  return (
    <div className="w-full min-w-[360px] px-2">
      <LoginCard className="mx-auto max-w-sm" />
    </div>
  );
}
