import { z } from 'zod';

export const acceptInvitationSchema = z.object({
  token: z
    .string({
      required_error: 'Token is required.',
      invalid_type_error: 'Token must be a string.'
    })
    .trim()
    .uuid('Token is invalid.')
    .min(1, 'Token is required.')
    .max(36, 'Maximum 36 characters allowed.')
});

export type AcceptInvitationSchema = z.infer<typeof acceptInvitationSchema>;
