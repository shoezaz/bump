import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

import { FeedbackEmail, type FeedbackEmailData } from '@/emails/feedback-email';
import type { NodeMailerPayload } from '@/lib/smtp/mailer/node-mailer-payload';
import { serverConfig } from '@/lib/smtp/mailer/server-config';

export async function sendFeedbackEmail(
  data: FeedbackEmailData
): Promise<void> {
  const component = FeedbackEmail(data);
  const html = await render(component);
  const text = await render(component, { plainText: true });
  const payload: NodeMailerPayload = {
    from: serverConfig.from,
    to: data.recipient,
    subject: 'User Feedback',
    html,
    text
  };

  await nodemailer.createTransport(serverConfig.transport).sendMail(payload);
}
