import { renderAsync } from '@react-email/render';
import nodemailer from 'nodemailer';

import {
  ConfirmEmailAddressChangeEmail,
  type ConfirmEmailAddressChangeEmailData
} from '@/emails/confirm-email-address-change-email';
import type { NodeMailerPayload } from '@/lib/smtp/mailer/node-mailer-payload';
import { serverConfig } from '@/lib/smtp/mailer/server-config';

export async function sendConfirmEmailAddressChangeEmail(
  data: ConfirmEmailAddressChangeEmailData
): Promise<void> {
  const component = ConfirmEmailAddressChangeEmail(data);
  const html = await renderAsync(component);
  const text = await renderAsync(component, { plainText: true });
  const payload: NodeMailerPayload = {
    from: serverConfig.from,
    to: data.recipient,
    subject: 'Change email instructions',
    html,
    text
  };

  await nodemailer.createTransport(serverConfig.transport).sendMail(payload);
}
