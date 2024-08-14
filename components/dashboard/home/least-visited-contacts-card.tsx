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

export type LeastVisitedContactsCardProps = CardProps & {
  contacts: VisitedContactDto[];
};

export function LeastVisitedContactsCard({
  contacts,
  ...props
}: LeastVisitedContactsCardProps): React.JSX.Element {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-base">Least visited contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <VisitedContactList contacts={contacts} />
      </CardContent>
    </Card>
  );
}
