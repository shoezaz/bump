import * as React from 'react';

import { VisitedContactList } from '@/components/dashboard/home/visited-contact-list';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type CardProps
} from '@/components/ui/card';
import type { VisitedContactDto } from '@/types/dtos/visited-contact-dto';

export type MostVisitedContactsCardProps = CardProps & {
  contacts: VisitedContactDto[];
};

export function MostVisitedContactsCard({
  contacts,
  ...props
}: MostVisitedContactsCardProps): React.JSX.Element {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-base">Most visited contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <VisitedContactList contacts={contacts} />
      </CardContent>
    </Card>
  );
}
