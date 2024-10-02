import * as React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

import { ContactAvatar } from '@/components/dashboard/contacts/details/contact-avatar';
import { buttonVariants } from '@/components/ui/button';
import { Routes } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { VisitedContactDto } from '@/types/dtos/visited-contact-dto';

export type VisitedContactListProps = React.HTMLAttributes<HTMLDivElement> & {
  contacts: VisitedContactDto[];
};

export function VisitedContactList({
  contacts,
  className,
  ...other
}: VisitedContactListProps): React.JSX.Element {
  return (
    <div
      className={cn('flex flex-col space-y-1', className)}
      {...other}
    >
      {contacts.map((contact) => (
        <VisitedContactListItem
          key={contact.id}
          contact={contact}
        />
      ))}
    </div>
  );
}

type VisitedContactListItemProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  contact: VisitedContactDto;
};

function VisitedContactListItem({
  contact,
  className,
  ...other
}: VisitedContactListItemProps): React.JSX.Element {
  return (
    <Link
      href={`${Routes.Contacts}/${contact.id}`}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'default' }),
        'w-full items-center justify-between px-3 group',
        className
      )}
      {...other}
    >
      <div className="flex flex-row items-center gap-2">
        <ContactAvatar
          record={contact.record}
          src={contact.image}
        />
        <span className="text-sm font-normal">{contact.name}</span>
      </div>
      <span className="group-hover:hidden">{contact.pageVisits}</span>
      <ArrowRightIcon className="h-4 w-4 shrink-0 hidden group-hover:inline" />
    </Link>
  );
}
