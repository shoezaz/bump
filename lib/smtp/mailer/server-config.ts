import { detectTransport } from '@/lib/smtp/mailer/detect-transport';
import type { NodeMailerOptions } from '@/lib/smtp/mailer/node-mailer-options';

export const serverConfig: NodeMailerOptions = {
  transport: detectTransport(),
  from: process.env.EMAIL_SENDER as string
};
