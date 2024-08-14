import { renderAsync } from '@react-email/render';
import nodemailer from 'nodemailer';

import {
  ConnectedAccountSecurityAlertEmail,
  type ConnectedAccountSecurityAlertEmailData
} from '@/emails/connected-account-security-alert-email';
import type { NodeMailerPayload } from '@/lib/smtp/mailer/node-mailer-payload';
import { serverConfig } from '@/lib/smtp/mailer/server-config';

export async function sendConnectedAccountSecurityAlertEmail(
  data: ConnectedAccountSecurityAlertEmailData
): Promise<void> {
  const component = ConnectedAccountSecurityAlertEmail(data);
  const html = await renderAsync(component);
  const text = await renderAsync(component, { plainText: true });
  const payload: NodeMailerPayload = {
    from: serverConfig.from,
    to: data.recipient,
    subject: 'Security Alert!',
    html,
    text
  };

  await nodemailer.createTransport(serverConfig.transport).sendMail(payload);
}
