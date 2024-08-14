import { BillingPlan } from '@/lib/billing/billing-plan';
import type { Subscription } from '@/types/subscription';

export function getHighestSubscription(
  subscriptions: Subscription[]
): [Subscription | null, BillingPlan] {
  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === 'active'
  );

  if (!process.env.PRO_PRODUCT_ID) {
    console.warn('No PRO_PRODUCT_ID found.');
  }

  if (activeSubscriptions && process.env.PRO_PRODUCT_ID) {
    const proPlan = activeSubscriptions.find(
      (subscription) =>
        subscription.plan?.product === process.env.PRO_PRODUCT_ID
    );

    if (proPlan) {
      if (proPlan.cancel_at_period_end) {
        return [proPlan, BillingPlan.ProPendingCancel];
      } else {
        return [proPlan, BillingPlan.Pro];
      }
    }
  }

  return [null, BillingPlan.Free];
}
