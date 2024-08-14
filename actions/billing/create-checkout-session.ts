'use server';

import type Stripe from 'stripe';

import { authActionClient } from '@/actions/safe-action';
import { Routes } from '@/constants/routes';
import { getStripeCustomerId } from '@/lib/billing/get-stripe-customer-id';
import { stripeServer } from '@/lib/billing/stripe-server';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import { NotFoundError } from '@/lib/validation/exceptions';

export const createCheckoutSession = authActionClient
  .metadata({ actionName: 'createCheckoutSession' })
  .action(async ({ ctx: { session } }) => {
    const stripeCustomerId = await getStripeCustomerId(
      session.user.organizationId
    );
    if (!stripeCustomerId) {
      throw new NotFoundError('Stripe customer not found');
    }

    if (!process.env.PRO_PRODUCT_PRICE_ID) {
      throw new NotFoundError('No PRO_PRODUCT_PRICE_ID found');
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.PRO_PRODUCT_PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'subscription',
      customer: stripeCustomerId,
      success_url: `${getBaseUrl()}${Routes.Billing}?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl()}${Routes.Billing}?status=canceled`,
      customer_update: {
        name: 'auto',
        address: 'auto'
      }
    };
    const checkoutSession: Stripe.Checkout.Session =
      await stripeServer.checkout.sessions.create(params);

    return {
      session: {
        id: checkoutSession.id
      }
    };
  });
