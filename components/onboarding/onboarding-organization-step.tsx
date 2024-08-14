'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { type CompleteOrganizationOnboardingSchema } from '@/schemas/onboarding/complete-organization-onboarding-schema';

export type OnboardingOrganizationStepProps =
  React.HtmlHTMLAttributes<HTMLDivElement> & {
    next: () => void;
    canNext: boolean;
    loading: boolean;
    isLastStep: boolean;
  };

export function OnboardingOrganizationStep({
  next,
  canNext,
  loading,
  isLastStep,
  className,
  ...other
}: OnboardingOrganizationStepProps): React.JSX.Element {
  const methods = useFormContext<CompleteOrganizationOnboardingSchema>();
  return (
    <div
      className={cn('flex w-full flex-col gap-4', className)}
      {...other}
    >
      <FormField
        control={methods.control}
        name="organizationName"
        render={({ field }) => (
          <FormItem className="flex w-full flex-col">
            <FormLabel required>Organization name</FormLabel>
            <FormControl>
              <Input
                type="text"
                maxLength={70}
                required
                disabled={loading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div>
        <Button
          type="button"
          variant="default"
          className="mt-4"
          disabled={!canNext}
          loading={loading}
          onClick={next}
        >
          {isLastStep ? 'Finish' : 'Next step →'}
        </Button>
      </div>
    </div>
  );
}
