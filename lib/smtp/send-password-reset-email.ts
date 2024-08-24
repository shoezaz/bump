import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

import {
  PasswordResetEmail,
  type PasswordResetEmailData
} from '@/emails/password-reset-email';
import type { NodeMailerPayload } from '@/lib/smtp/mailer/node-mailer-payload';
import { serverConfig } from '@/lib/smtp/mailer/server-config';

export async function sendPasswordResetEmail(
  data: PasswordResetEmailData
): Promise<void> {
  const component = PasswordResetEmail(data);
  const html = await render(component);
  const text = await render(component, { plainText: true });
  const payload: NodeMailerPayload = {
    from: serverConfig.from,
    to: data.recipient,
    subject: 'Reset password instructions',
    html,
    text
  };

  await nodemailer.createTransport(serverConfig.transport).sendMail(payload);
}
