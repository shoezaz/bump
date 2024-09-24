'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { InvitationStatus } from '@prisma/client';

import { actionClient } from '@/actions/safe-action';
import { Routes } from '@/constants/routes';
import { Caching, OrganizationCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { acceptInvitationSchema } from '@/schemas/invitations/accept-invitation-schema';

export const acceptInvitation = actionClient
  .metadata({ actionName: 'acceptInvitation' })
  .schema(acceptInvitationSchema)
  .action(async ({ parsedInput }) => {
    const invitation = await prisma.invitation.findFirst({
      where: { token: parsedInput.token },
      select: {
        id: true,
        email: true,
        status: true,
        organization: {
          select: {
            id: true
          }
        }
      }
    });
    if (!invitation) {
      throw new NotFoundError('Invitation not found.');
    }

    if (invitation.status === InvitationStatus.ACCEPTED) {
      return redirect(Routes.InvitationAlreadyAccepted);
    }

    const [countUsers, countInvitations] = await prisma.$transaction([
      prisma.user.count({
        where: { email: invitation.email }
      }),
      prisma.invitation.count({
        where: {
          email: invitation.email,
          organizationId: invitation.organization.id,
          AND: [
            { NOT: { token: { equals: parsedInput.token } } },
            { NOT: { status: { equals: InvitationStatus.ACCEPTED } } },
            { NOT: { status: { equals: InvitationStatus.REVOKED } } }
          ]
        }
      })
    ]);

    const isAvailable = countUsers === 0 && countInvitations === 0;
    if (!isAvailable) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.REVOKED }
      });
      invitation.status = InvitationStatus.REVOKED;
    }

    if (invitation.status === InvitationStatus.REVOKED) {
      return redirect(Routes.InvitationRevoked);
    }

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Invitations,
        invitation.organization.id
      )
    );
  });
