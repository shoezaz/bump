import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE
} from 'next-safe-action';
import { z } from 'zod';

import { dedupedAuth } from '@/lib/auth';
import { checkSession } from '@/lib/auth/session';
import {
  ForbiddenError,
  GatewayError,
  NotFoundError,
  PreConditionError,
  UnauthorizedError,
  ValidationError
} from '@/lib/validation/exceptions';

export const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    if (
      e instanceof ValidationError ||
      e instanceof UnauthorizedError ||
      e instanceof ForbiddenError ||
      e instanceof NotFoundError ||
      e instanceof PreConditionError ||
      e instanceof GatewayError
    ) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string()
    });
  }
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    throw new UnauthorizedError();
  }

  return next({ ctx: { session } });
});
