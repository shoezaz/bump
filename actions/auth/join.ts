'use server';

import { revalidateTag } from 'next/cache';
import { InvitationStatus } from '@prisma/client';

import { logIn } from '@/actions/auth/log-in';
import { actionClient } from '@/actions/safe-action';
import { Caching, OrganizationCacheKey } from '@/data/caching';
import { joinOrganization } from '@/lib/auth/organization';
import { hashPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError, PreConditionError } from '@/lib/validation/exceptions';
import { joinSchema } from '@/schemas/auth/join-schema';

export const join = actionClient
  .metadata({ actionName: 'join' })
  .schema(joinSchema)
  .action(async ({ parsedInput }) => {
    const invitation = await prisma.invitation.findFirst({
      where: { id: parsedInput.invitationId },
      select: {
        status: true,
        email: true,
        role: true,
        organizationId: true
      }
    });
    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }
    if (invitation.status === InvitationStatus.REVOKED) {
      throw new PreConditionError('Invitation was revoked');
    }
    if (invitation.status === InvitationStatus.ACCEPTED) {
      throw new PreConditionError('Invitation was already accepted');
    }
    const countOrganization = await prisma.organization.count({
      where: { id: invitation.organizationId }
    });
    if (countOrganization < 1) {
      throw new NotFoundError('Organization not found');
    }

    const normalizedEmail = invitation.email.toLowerCase();
    const hashedPassword = await hashPassword(parsedInput.password);

    const existingUser = await prisma.user.findFirst({
      where: { email: normalizedEmail }
    });
    if (existingUser) {
      throw new PreConditionError('Email address is already registered');
    }

    await joinOrganization({
      invitationId: parsedInput.invitationId,
      organizationId: invitation.organizationId,
      name: parsedInput.name,
      normalizedEmail,
      hashedPassword,
      role: invitation.role
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Members,
        invitation.organizationId
      )
    );
    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Invitations,
        invitation.organizationId
      )
    );

    return await logIn({
      email: parsedInput.email,
      password: parsedInput.password
    });
  });
