import * as React from 'react';
import { type Metadata } from 'next';

import { InvitationAlreadyAcceptedCard } from '@/components/invitations/invitation-already-accepted-card';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Already accepted')
};

export default function InvitationAlreadyAcceptedPage(): React.JSX.Element {
  return (
    <div className="w-full min-w-[360px] px-2">
      <InvitationAlreadyAcceptedCard className="mx-auto max-w-sm" />
    </div>
  );
}
