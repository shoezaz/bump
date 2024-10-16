'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { PlusIcon } from 'lucide-react';

import { InviteMemberModal } from '@/components/dashboard/settings/organization/members/invite-member-modal';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import type { ProfileDto } from '@/types/dtos/profile-dto';

export type InviteMemberButtonProps = {
  profile: ProfileDto;
  isCollapsed?: boolean;
};

export function InviteMemberButton({
  profile,
  isCollapsed
}: InviteMemberButtonProps): React.JSX.Element {
  const handleShowInviteMemberModal = (): void => {
    NiceModal.show(InviteMemberModal, { profile });
  };
  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="default"
            variant="ghost"
            className="size-9 max-h-9 min-h-9 min-w-9 max-w-9 items-center justify-center font-normal text-muted-foreground"
            onClick={handleShowInviteMemberModal}
          >
            <PlusIcon className="size-4 shrink-0" />
            <span className="sr-only">Invite member</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Invite member</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button
      type="button"
      size="default"
      variant="ghost"
      className="w-full items-center justify-start gap-2 px-3 py-2 font-normal text-muted-foreground"
      onClick={handleShowInviteMemberModal}
    >
      <PlusIcon className="size-4 shrink-0" />
      <span>Invite member</span>
    </Button>
  );
}
