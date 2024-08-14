import * as React from 'react';
import { type Metadata } from 'next';

import { InvitationRevokedCard } from '@/components/invitations/invitation-revoked-card';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Invitation revoked')
};

export default function InvitationRevokedPage(): React.JSX.Element {
  return (
    <div className="w-full min-w-[360px] px-2">
      <InvitationRevokedCard className="mx-auto max-w-sm" />;
    </div>
  );
}
