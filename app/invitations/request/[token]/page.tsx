import * as React from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { validate as uuidValidate } from 'uuid';

import { acceptInvitation } from '@/actions/invitations/accept-invitation';
import { JoinOrganizationCard } from '@/components/invitations/join-organization-card';
import { prisma } from '@/lib/db/prisma';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

type Params = {
  token?: string;
};

export const metadata: Metadata = {
  title: createTitle('Join organization')
};

export default async function InvitationPage(
  props: NextPageProps & { params: Params }
): Promise<React.JSX.Element> {
  const token = props.params.token;
  if (!token || !uuidValidate(token)) {
    return notFound();
  }

  const invitation = await prisma.invitation.findFirst({
    where: { token },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      organiation: {
        select: {
          name: true
        }
      }
    }
  });
  if (!invitation) {
    return notFound();
  }

  await acceptInvitation({ token });

  return (
    <div className="w-full min-w-[360px] px-2">
      <JoinOrganizationCard
        className="mx-auto max-w-md"
        invitation={invitation}
        organizationName={invitation.organiation.name}
      />
    </div>
  );
}
