import * as React from 'react';
import { type Metadata } from 'next';

import { SignUpCard } from '@/components/auth/sign-up/sign-up-card';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Sign up')
};

export default function SignUpPage(): React.JSX.Element {
  return (
    <div className="w-full min-w-[360px] px-2">
      <SignUpCard className="mx-auto max-w-md" />
    </div>
  );
}
