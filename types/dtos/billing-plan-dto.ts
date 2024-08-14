import { BillingPlan } from '@/lib/billing/billing-plan';
import type { Maybe } from '@/types/maybe';

export type BillingPlanDto = {
  name: string;
  identifier: BillingPlan;
  isCanceled: boolean;
  stripeCurrentPeriodEnd: Maybe<number>;
};
