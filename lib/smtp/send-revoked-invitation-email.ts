import { renderAsync } from '@react-email/render';
import nodemailer from 'nodemailer';

import {
  RevokedInvitationEmail,
  type RevokedInvitationEmailData
} from '@/emails/revoked-invitation-email';
import type { NodeMailerPayload } from '@/lib/smtp/mailer/node-mailer-payload';
import { serverConfig } from '@/lib/smtp/mailer/server-config';

export async function sendRevokedInvitationEmail(
  data: RevokedInvitationEmailData
): Promise<void> {
  const component = RevokedInvitationEmail(data);
  const html = await renderAsync(component);
  const text = await renderAsync(component, { plainText: true });
  const payload: NodeMailerPayload = {
    from: serverConfig.from,
    to: data.recipient,
    subject: 'Invitation revoked',
    html,
    text
  };

  await nodemailer.createTransport(serverConfig.transport).sendMail(payload);
}
