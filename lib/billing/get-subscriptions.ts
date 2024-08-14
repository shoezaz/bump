import { stripeServer } from '@/lib/billing/stripe-server';
import type { Subscription } from '@/types/subscription';

export async function getSubscriptions(
  stripeCustomerId: string
): Promise<Subscription[]> {
  const result = await stripeServer.subscriptions.list({
    customer: stripeCustomerId
  });

  return result.data || [];
}
