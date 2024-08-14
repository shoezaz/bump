import type Stripe from 'stripe';

import { stripeServer } from '@/lib/billing/stripe-server';

export async function getStripeInvoices(
  stripeCustomerId: string
): Promise<Stripe.Invoice[]> {
  const invoices = await stripeServer.invoices.list({
    customer: stripeCustomerId
  });

  return invoices.data;
}
