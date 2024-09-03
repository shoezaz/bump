import * as React from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { validate as uuidValidate } from 'uuid';

import { changeEmail } from '@/actions/account/change-email';
import { AuthContainer } from '@/components/auth/auth-logo';
import { ChangeEmailSuccessCard } from '@/components/auth/change-email/change-email-success-card';
import { prisma } from '@/lib/db/prisma';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

type Params = {
  requestId?: string;
};

export const metadata: Metadata = {
  title: createTitle('Change email')
};

export default async function ChangeEmailPage(
  props: NextPageProps & { params: Params }
): Promise<React.JSX.Element> {
  const requestId = props.params.requestId;
  if (!requestId || !uuidValidate(requestId)) {
    return notFound();
  }

  const request = await prisma.changeEmailRequest.findFirst({
    where: { id: requestId },
    select: { email: true }
  });
  if (!request) {
    return notFound();
  }

  await changeEmail({ id: requestId });

  return (
    <AuthContainer maxWidth="sm">
      <ChangeEmailSuccessCard email={request.email} />
    </AuthContainer>
  );
}
