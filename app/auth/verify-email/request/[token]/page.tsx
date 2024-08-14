import * as React from 'react';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { isAfter } from 'date-fns';

import { verifyEmailWithToken } from '@/actions/auth/verify-email-with-token';
import { Routes } from '@/constants/routes';
import { prisma } from '@/lib/db/prisma';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

type Params = {
  token?: string;
};

export const metadata: Metadata = {
  title: createTitle('Email Verification')
};

export default async function EmailVerificationPage(
  props: NextPageProps & { params: Params }
): Promise<React.JSX.Element> {
  const token = props.params.token;
  if (!token) {
    return notFound();
  }
  const verificationToken = await prisma.verificationToken.findFirst({
    where: { token },
    select: { identifier: true, expires: true }
  });
  if (!verificationToken) {
    return notFound();
  }
  const user = await prisma.user.findFirst({
    where: { email: verificationToken.identifier },
    select: { emailVerified: true }
  });
  if (!user) {
    return notFound();
  }
  if (user.emailVerified) {
    return redirect(Routes.VerifyEmailSuccess);
  }

  if (isAfter(new Date(), verificationToken.expires)) {
    return redirect(
      `${Routes.VerifyEmailExpired}?email=${verificationToken.identifier}`
    );
  }

  await verifyEmailWithToken({ token: token });

  return redirect(Routes.VerifyEmailSuccess);
}
