'use client';

import * as React from 'react';
import { ExternalLinkIcon } from 'lucide-react';
import { toast } from 'sonner';

import { createBillingPortalSessionUrl } from '@/actions/billing/create-billing-portal-session-url';
import { createCheckoutSession } from '@/actions/billing/create-checkout-session';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  type CardProps
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AppInfo } from '@/constants/app-info';
import { BillingPlan } from '@/lib/billing/billing-plan';
import { formatStripeDate, getStripeClient } from '@/lib/billing/stripe-client';
import type { BillingPlanDto } from '@/types/dtos/billing-plan-dto';

export type BillingPlanCardProps = CardProps & {
  plan: BillingPlanDto;
};

export function BillingPlanCard({
  plan,
  ...other
}: BillingPlanCardProps): React.JSX.Element {
  const [loading, setLoading] = React.useState(false);

  const handleBillingRedirect = async (): Promise<void> => {
    setLoading(true);
    try {
      if (plan.identifier === BillingPlan.Free) {
        await handleUpgrade();
      } else {
        await handleBillingPortalRedirect();
      }
    } catch (error) {
      console.error('Billing redirect error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (): Promise<void> => {
    const result = await createCheckoutSession();
    if (result?.data?.session?.id) {
      const stripe = await getStripeClient();
      const { error } = await stripe!.redirectToCheckout({
        sessionId: result.data.session.id
      });
      if (error?.message) {
        toast.error(error.message);
      }
    } else {
      toast.error('Failed to create checkout session. Please try again.');
    }
  };

  const handleBillingPortalRedirect = async (): Promise<void> => {
    const result = await createBillingPortalSessionUrl();
    if (result?.data?.url) {
      window.location.href = result.data.url;
    } else {
      toast.error('Failed to create billing portal session. Please try again.');
    }
  };

  return (
    <Card {...other}>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">
          We partner with Stripe to handle billings for {AppInfo.APP_NAME}.
          <br className="hidden sm:inline" /> You are currently on the{' '}
          <strong>{plan.name}</strong> plan.
        </p>
        {plan.stripeCurrentPeriodEnd && (
          <p className="mt-4 text-sm text-muted-foreground">
            {plan.isCanceled
              ? 'Your plan will be canceled on '
              : 'Your plan renews on '}
            {formatStripeDate(plan.stripeCurrentPeriodEnd)}.
          </p>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex w-full justify-end pt-6">
        <Button
          type="button"
          variant="default"
          size="default"
          disabled={loading}
          loading={loading}
          onClick={handleBillingRedirect}
        >
          {plan.identifier === BillingPlan.Free ? 'Upgrade' : 'Billing portal'}
          <ExternalLinkIcon className="ml-2 size-4 shrink-0" />
        </Button>
      </CardFooter>
    </Card>
  );
}
