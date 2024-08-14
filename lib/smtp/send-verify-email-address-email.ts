import { renderAsync } from '@react-email/render';
import nodemailer from 'nodemailer';

import {
  VerifyEmailAddressEmail,
  type VerifyEmailAddressEmailData
} from '@/emails/verify-email-address-email';
import type { NodeMailerPayload } from '@/lib/smtp/mailer/node-mailer-payload';
import { serverConfig } from '@/lib/smtp/mailer/server-config';

export async function sendVerifyEmailAddressEmail(
  data: VerifyEmailAddressEmailData
): Promise<void> {
  const component = VerifyEmailAddressEmail(data);
  const html = await renderAsync(component);
  const text = await renderAsync(component, { plainText: true });
  const payload: NodeMailerPayload = {
    from: serverConfig.from,
    to: data.recipient,
    subject: 'Verify email address',
    html,
    text
  };

  await nodemailer.createTransport(serverConfig.transport).sendMail(payload);
}
