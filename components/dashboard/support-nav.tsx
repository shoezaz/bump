import * as React from 'react';

import { FeedbackButton } from '@/components/dashboard//feedback-button';
import { InviteMemberButton } from '@/components/dashboard/invite-member-button';
import type { ProfileDto } from '@/types/dtos/profile-dto';

export type SupportNavProps = React.HTMLAttributes<HTMLDivElement> & {
  profile: ProfileDto;
  isCollapsed?: boolean;
};

export function SupportNav({
  profile,
  isCollapsed
}: SupportNavProps): React.JSX.Element {
  return (
    <nav className="space-y-1">
      <InviteMemberButton
        profile={profile}
        isCollapsed={isCollapsed}
      />
      <FeedbackButton isCollapsed={isCollapsed} />
    </nav>
  );
}
