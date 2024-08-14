'use server';

import { cookies } from 'next/headers';

import { authActionClient } from '@/actions/safe-action';
import { signOut } from '@/lib/auth';
import { AuthCookies } from '@/lib/auth/cookies';
import { prisma } from '@/lib/db/prisma';
import { signOutSessionSchema } from '@/schemas/account/sign-out-session-schema';

export const signOutSession = authActionClient
  .metadata({ actionName: 'signOutSession' })
  .schema(signOutSessionSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    const currrentSessionToken =
      cookies().get(AuthCookies.SessionToken)?.value ?? '';

    const deletedSession = await prisma.session.delete({
      where: {
        userId: session.user.id,
        id: parsedInput.id
      },
      select: { sessionToken: true }
    });

    if (deletedSession.sessionToken === currrentSessionToken) {
      await signOut();
    }
  });
