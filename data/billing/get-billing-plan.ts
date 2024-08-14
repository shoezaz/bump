import 'server-only';

import { redirect } from 'next/navigation';

import { dedupedAuth } from '@/lib/auth';
import { getLoginRedirect } from '@/lib/auth/redirect';
import { checkSession } from '@/lib/auth/session';
import { BillingPlan } from '@/lib/billing/billing-plan';
import { getStripeCustomerId } from '@/lib/billing/get-stripe-customer-id';
import { syncWithStripe } from '@/lib/billing/sync-with-stripe';
import type { BillingPlanDto } from '@/types/dtos/billing-plan-dto';

export async function getBillingPlan(): Promise<BillingPlanDto> {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getLoginRedirect());
  }

  const stripeCustomerId = await getStripeCustomerId(
    session.user.organizationId
  );

  const [activeSubscription, currentPlan] =
    await syncWithStripe(stripeCustomerId);

  const response: BillingPlanDto = {
    name: getName(currentPlan),
    identifier: currentPlan,
    isCanceled: !!activeSubscription?.cancel_at_period_end,
    stripeCurrentPeriodEnd: activeSubscription?.current_period_end
  };

  return response;
}

function getName(plan: BillingPlan): string {
  if (plan === BillingPlan.Free) return 'Free';
  if (plan === BillingPlan.Pro) return 'Pro';
  if (plan === BillingPlan.ProPendingCancel) return 'Pro';

  return '';
}
