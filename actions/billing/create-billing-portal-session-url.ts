'use server';

import type Stripe from 'stripe';

import { authActionClient } from '@/actions/safe-action';
import { Routes } from '@/constants/routes';
import { getStripeCustomerId } from '@/lib/billing/get-stripe-customer-id';
import { stripeServer } from '@/lib/billing/stripe-server';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import { NotFoundError } from '@/lib/validation/exceptions';

export const createBillingPortalSessionUrl = authActionClient
  .metadata({ actionName: 'createBillingPortalSessionUrl' })
  .action(async ({ ctx: { session } }) => {
    const stripeCustomerId = await getStripeCustomerId(
      session.user.organizationId
    );
    if (!stripeCustomerId) {
      throw new NotFoundError('Stripe customer not found');
    }

    const billingPortalSession: Stripe.BillingPortal.Session =
      await stripeServer.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${getBaseUrl()}${Routes.Billing}`
      });

    return { url: billingPortalSession.url };
  });
