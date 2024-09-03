import * as React from 'react';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { isAfter } from 'date-fns';

import { AuthContainer } from '@/components/auth/auth-container';
import { ResetPasswordCard } from '@/components/auth/reset-password/reset-password-card';
import { Routes } from '@/constants/routes';
import { prisma } from '@/lib/db/prisma';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

type Params = {
  requestId?: string;
};

export const metadata: Metadata = {
  title: createTitle('Reset password')
};

export default async function ResetPasswordPage(
  props: NextPageProps & { params: Params }
): Promise<React.JSX.Element> {
  const requestId = props.params.requestId;
  if (!requestId) {
    return notFound();
  }

  const resetPasswordRequest = await prisma.resetPasswordRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      expires: true
    }
  });

  if (!resetPasswordRequest) {
    return notFound();
  }

  if (isAfter(new Date(), resetPasswordRequest.expires)) {
    return redirect(Routes.ResetPasswordExpired);
  }

  return (
    <AuthContainer maxWidth="sm">
      <ResetPasswordCard
        requestId={requestId}
        expires={resetPasswordRequest.expires}
      />
    </AuthContainer>
  );
}
