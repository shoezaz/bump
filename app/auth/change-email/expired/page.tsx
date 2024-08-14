import * as React from 'react';
import { type Metadata } from 'next';

import { ChangeEmailExpiredCard } from '@/components/auth/change-email/change-email-expired-card';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Expired change request')
};

export default function ChangeEmailExpiredPage(): React.JSX.Element {
  return (
    <div className="w-full min-w-[360px] px-2">
      <ChangeEmailExpiredCard className="mx-auto max-w-sm" />
    </div>
  );
}
