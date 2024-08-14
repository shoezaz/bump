import { BillingPlan } from '@/lib/billing/billing-plan';
import { getHighestSubscription } from '@/lib/billing/get-highest-subscription';
import { getSubscriptions } from '@/lib/billing/get-subscriptions';
import { prisma } from '@/lib/db/prisma';
import type { Maybe } from '@/types/maybe';
import type { Subscription } from '@/types/subscription';

export async function syncWithStripe(
  stripeCustomerId: Maybe<string>
): Promise<[Subscription | null, BillingPlan]> {
  if (!stripeCustomerId) {
    return [null, BillingPlan.Free];
  }

  const organization = await prisma.organization.findFirst({
    where: { stripeCustomerId },
    select: {
      id: true,
      billingPlan: true,
      stripeCustomerId: true
    }
  });

  if (!organization) {
    return [null, BillingPlan.Free];
  }

  const subscriptions = await getSubscriptions(organization.stripeCustomerId);
  const [activeSubscription, currentPlan] =
    getHighestSubscription(subscriptions);

  if (currentPlan !== organization.billingPlan) {
    if (activeSubscription === null || currentPlan === BillingPlan.Free) {
      await prisma.organization.update({
        where: { id: organization.id },
        data: { billingPlan: BillingPlan.Free }
      });
    } else {
      await prisma.organization.update({
        where: { id: organization.id },
        data: { billingPlan: currentPlan }
      });
    }
  }

  return [activeSubscription, currentPlan];
}
