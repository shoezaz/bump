import * as React from 'react';

import { AnnotatedSection } from '@/components/ui/annotated';

export default function BillingPlanLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Billing plan"
      description="View and edit your billing details, as well as upgrade or cancel your subscription."
    >
      {children}
    </AnnotatedSection>
  );
}
