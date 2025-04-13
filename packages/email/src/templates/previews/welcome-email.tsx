import * as React from 'react';

import { WelcomeEmail } from '@workspace/email/templates/welcome-email';

export default function WelcomeEmailPreview(): React.JSX.Element {
  return (
    <WelcomeEmail
      appName="Acme"
      getStartedLink="https://example.com/organizations"
      name="John Doe"
    />
  );
}
