import 'server-only';

import { redirect } from 'next/navigation';
import type Stripe from 'stripe';

import { dedupedAuth } from '@/lib/auth';
import { getLoginRedirect } from '@/lib/auth/redirect';
import { checkSession } from '@/lib/auth/session';
import { getStripeCustomerId } from '@/lib/billing/get-stripe-customer-id';
import { getStripeInvoices } from '@/lib/billing/get-stripe-invoices';
import { GatewayError, PreConditionError } from '@/lib/validation/exceptions';
import type { InvoiceDto } from '@/types/dtos/invoice-dto';

export async function getInvoices(): Promise<InvoiceDto[]> {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getLoginRedirect());
  }

  const stripeCustomerId = await getStripeCustomerId(
    session.user.organizationId
  );
  if (!stripeCustomerId) {
    throw new PreConditionError('Stripe customer not found');
  }

  let invoices: Stripe.Invoice[];
  try {
    invoices = await getStripeInvoices(stripeCustomerId);
  } catch (e) {
    console.error(e);
    throw new GatewayError();
  }

  const response: InvoiceDto[] = invoices.map((invoice) => ({
    id: invoice.id,
    number: invoice.number,
    invoicePdfUrl: invoice.invoice_pdf,
    date: invoice.created,
    amount: invoice.total,
    status: invoice.status
  }));

  return response;
}
