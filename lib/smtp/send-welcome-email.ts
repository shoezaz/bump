import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

import { AppInfo } from '@/constants/app-info';
import { WelcomeEmail, type WelcomeEmailData } from '@/emails/welcome-email';
import type { NodeMailerPayload } from '@/lib/smtp/mailer/node-mailer-payload';
import { serverConfig } from '@/lib/smtp/mailer/server-config';

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  const component = WelcomeEmail(data);
  const html = await render(component);
  const text = await render(component, { plainText: true });
  const payload: NodeMailerPayload = {
    from: serverConfig.from,
    to: data.recipient,
    subject: `Welcome to ${AppInfo.APP_NAME}`,
    html,
    text
  };

  await nodemailer.createTransport(serverConfig.transport).sendMail(payload);
}
