import { randomUUID } from 'crypto';
import { addSeconds } from 'date-fns';
import { type NextAuthConfig, type Session } from 'next-auth';
import { validate as uuidValidate } from 'uuid';

import { isDefined, type IsDefinedGuard } from '@/lib/validation/is-defined';
import { isString } from '@/lib/validation/is-string';
import type { Maybe } from '@/types/maybe';

export function checkSession(
  session: Maybe<Session>
): session is IsDefinedGuard<
  Session & {
    user: IsDefinedGuard<Session['user']> & {
      id: string;
      email: string;
      name: string;
      organizationId: string;
    };
  }
> {
  if (!session) {
    return false;
  }

  if (!session.user) {
    console.warn('No user found in the session. Unable to validate session.');
    return false;
  }

  const { user } = session;

  const hasValidId = isDefined(user.id) && uuidValidate(user.id);
  const hasValidEmail = isDefined(user.email) && isString(user.email);
  const hasValidName = isDefined(user.name) && isString(user.name);
  const hasValidOrganizationId =
    isDefined(user.organizationId) && uuidValidate(user.organizationId);

  // Logs a warning if the user in the session is missing an organizationId.
  // Provides a detailed, contextual warning based on available user information.
  if (!hasValidOrganizationId) {
    const userIdentifier = hasValidId
      ? `User ID: ${session.user.id}`
      : hasValidEmail
        ? `User Email: ${session.user.email}`
        : 'Unknown User';

    const errorType = !isDefined(user.organizationId)
      ? 'missing'
      : 'invalid format';

    console.warn(`${userIdentifier} has a ${errorType} organizationId. 
      This may indicate an issue with user organization assignment.
      Please check the methods createOrganizationAndConnectUser and joinOrganization.`);
  }

  return hasValidId && hasValidEmail && hasValidName && hasValidOrganizationId;
}

export function generateSessionToken(): string {
  return randomUUID();
}

export function getSessionExpiryFromNow(): Date {
  return addSeconds(Date.now(), session.maxAge);
}

export const session = {
  strategy: 'database',
  maxAge: 60 * 60 * 24 * 30, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
  generateSessionToken
} satisfies NextAuthConfig['session'];
