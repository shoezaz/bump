export type NodeMailerPayload = {
  to: string;
  from: string;
  subject?: string;
  text?: string;
  html?: string;
};
