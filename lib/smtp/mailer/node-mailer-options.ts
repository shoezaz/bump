import type { NodeMailerTransport } from '@/lib/smtp/mailer/node-mailer-transport';

export type NodeMailerOptions = {
  transport: NodeMailerTransport;
  from: string;
};
