import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

import {
  InvitationEmail,
  type InvitationEmailData
} from '@/emails/invitation-email';
import type { NodeMailerPayload } from '@/lib/smtp/mailer/node-mailer-payload';
import { serverConfig } from '@/lib/smtp/mailer/server-config';

export async function sendInvitationEmail(
  data: InvitationEmailData
): Promise<void> {
  const component = InvitationEmail(data);
  const html = await render(component);
  const text = await render(component, { plainText: true });
  const payload: NodeMailerPayload = {
    from: serverConfig.from,
    to: data.recipient,
    subject: 'Organization invitation',
    html,
    text
  };

  await nodemailer.createTransport(serverConfig.transport).sendMail(payload);
}
