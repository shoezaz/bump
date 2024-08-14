'use client';

import * as React from 'react';
import Link from 'next/link';
import { MoreHorizontalIcon } from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatStripeDate } from '@/lib/billing/stripe-client';
import { capitalize, cn } from '@/lib/utils';
import type { InvoiceDto, InvoiceStatus } from '@/types/dtos/invoice-dto';

export type InvoiceListProps = React.HtmlHTMLAttributes<HTMLUListElement> & {
  invoices: InvoiceDto[];
};

export function InvoiceList({
  invoices,
  className,
  ...other
}: InvoiceListProps): React.JSX.Element {
  return (
    <ul
      role="list"
      className={cn('m-0 list-none divide-y p-0', className)}
      {...other}
    >
      {invoices.map((invoice) => (
        <InvoiceListItem
          key={invoice.id}
          invoice={invoice}
        />
      ))}
    </ul>
  );
}

function mapInvoiceStatusToBadgeVariant(
  status: InvoiceStatus
): BadgeProps['variant'] {
  switch (status) {
    case 'draft':
    case 'open': {
      return 'outline';
    }

    case 'paid':
    case 'void': {
      return 'secondary';
    }

    case 'uncollectible': {
      return 'destructive';
    }

    default: {
      return 'default';
    }
  }
}

type InvoiceListItemProps = React.HtmlHTMLAttributes<HTMLLIElement> & {
  invoice: InvoiceDto;
};

function InvoiceListItem({
  invoice,
  className,
  ...other
}: InvoiceListItemProps): React.JSX.Element {
  return (
    <li
      role="listitem"
      className={cn('flex w-full flex-row justify-between p-6', className)}
      {...other}
    >
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 text-sm font-medium">
          #{invoice.number}
          {!!invoice.status && (
            <Badge variant={mapInvoiceStatusToBadgeVariant(invoice.status)}>
              {capitalize(invoice.status)}
            </Badge>
          )}
        </div>
        <div className="text-xs font-normal text-muted-foreground">
          {formatStripeDate(invoice.date)}
        </div>
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="size-8 p-0"
            title="Open menu"
          >
            <MoreHorizontalIcon className="size-4 shrink-0" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            asChild
            disabled={!invoice.invoicePdfUrl}
          >
            <Link href={invoice.invoicePdfUrl ?? '#'}>Download</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}
