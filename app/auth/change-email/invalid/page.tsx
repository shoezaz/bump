import * as React from 'react';
import { type Metadata } from 'next';

import { ChangeEmailInvalidCard } from '@/components/auth/change-email/change-email-invalid-card';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Invalid change request')
};

export default function ChangeEmailInvalidPage(): React.JSX.Element {
  return (
    <div className="w-full min-w-[360px] px-2">
      <ChangeEmailInvalidCard className="mx-auto max-w-sm" />
    </div>
  );
}
