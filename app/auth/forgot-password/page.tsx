import * as React from 'react';
import { type Metadata } from 'next';

import { ForgotPasswordCard } from '@/components/auth/forgot-password/forgot-password-card';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Forgot password')
};

export default function ForgotPasswordPage(): React.JSX.Element {
  return (
    <div className="w-full min-w-[360px] max-w-sm">
      <ForgotPasswordCard className="mx-auto max-w-sm" />
    </div>
  );
}
