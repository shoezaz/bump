import * as React from 'react';
import { type Metadata } from 'next';

import { AnnotatedLayout } from '@/components/ui/annotated';
import {
  Page,
  PageBody,
  PageHeader,
  PagePrimaryBar,
  PageTitle
} from '@/components/ui/page';
import { Separator } from '@/components/ui/separator';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Billing')
};

export type BillingLayoutProps = {
  billingPlan: React.ReactNode;
  invoices: React.ReactNode;
};

export default function BillingLayout({
  billingPlan,
  invoices
}: BillingLayoutProps): React.JSX.Element {
  return (
    <Page>
      <PageHeader>
        <PagePrimaryBar>
          <PageTitle>Billing</PageTitle>
        </PagePrimaryBar>
      </PageHeader>
      <PageBody>
        <AnnotatedLayout>
          {billingPlan}
          <Separator />
          {invoices}
        </AnnotatedLayout>
      </PageBody>
    </Page>
  );
}
