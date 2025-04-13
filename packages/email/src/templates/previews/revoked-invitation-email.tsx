import * as React from 'react';

import { RevokedInvitationEmail } from '@workspace/email/templates/revoked-invitation-email';

export default function RevokedInvitationEmailPreview(): React.JSX.Element {
  return (
    <RevokedInvitationEmail
      appName="Acme"
      organizationName="Evil Corp"
    />
  );
}
