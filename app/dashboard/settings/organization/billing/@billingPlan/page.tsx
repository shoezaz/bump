import * as React from 'react';

import { BillingPlanCard } from '@/components/dashboard/settings/organization/billing/billing-plan-card';
import { getBillingPlan } from '@/data/billing/get-billing-plan';

export default async function BillingPlanPage(): Promise<React.JSX.Element> {
  const plan = await getBillingPlan();
  return <BillingPlanCard plan={plan} />;
}
