import { headers } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';

import { stripeServer } from '@/lib/billing/stripe-server';
import { syncWithStripe } from '@/lib/billing/sync-with-stripe';

function extractCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null
): string | null {
  if (!customer) {
    return null;
  }

  if (typeof customer === 'string') {
    return customer;
  }

  if (customer && typeof customer === 'object' && 'id' in customer) {
    return customer.id;
  }

  return null;
}

const relevantEvents = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'checkout.session.completed'
]);

export async function POST(req: NextRequest): Promise<Response> {
  const headersList = headers();
  const sig = headersList.get('stripe-signature');
  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature' },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Missing process.env.STRIPE_WEBHOOK_SECRET' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripeServer.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(`Error message: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          if (!subscription.id) {
            return NextResponse.json(
              { error: 'Subscription ID not found' },
              {
                status: 400,
                headers: {
                  'Cache-Control': 'no-store'
                }
              }
            );
          }

          const stripeCustomerId = extractCustomerId(subscription.customer);
          if (!stripeCustomerId) {
            return NextResponse.json(
              { error: 'Invalid customer information in the subscription' },
              {
                status: 400,
                headers: {
                  'Cache-Control': 'no-store'
                }
              }
            );
          }

          await syncWithStripe(stripeCustomerId);

          break;
        }
        case 'checkout.session.completed': {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === 'subscription') {
            if (!checkoutSession.subscription) {
              return NextResponse.json(
                { error: 'Subscription ID not found' },
                {
                  status: 400,
                  headers: {
                    'Cache-Control': 'no-store'
                  }
                }
              );
            }
            const subscriptionId = Array.isArray(checkoutSession.subscription)
              ? checkoutSession.subscription[0]
              : checkoutSession.subscription;
            if (!subscriptionId) {
              return NextResponse.json(
                { error: 'Subscription ID not found' },
                {
                  status: 400,
                  headers: {
                    'Cache-Control': 'no-store'
                  }
                }
              );
            }

            const stripeCustomerId = extractCustomerId(
              checkoutSession.customer
            );
            if (!stripeCustomerId) {
              return NextResponse.json(
                { error: 'Invalid customer information in the subscription' },
                {
                  status: 400,
                  headers: {
                    'Cache-Control': 'no-store'
                  }
                }
              );
            }

            await syncWithStripe(stripeCustomerId);
          }
          break;
        }
        default: {
          console.warn(`Unhandled event type ${event.type}`);
        }
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Webhook error: "Webhook handler failed. View logs."' },
        {
          status: 400,
          headers: {
            'Cache-Control': 'no-store'
          }
        }
      );
    }
  }

  return NextResponse.json({
    received: true,
    status: 'Webhook called.',
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}
