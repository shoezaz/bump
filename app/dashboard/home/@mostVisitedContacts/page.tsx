import * as React from 'react';

import { searchParamsCache } from '@/components/dashboard/home/home-search-params';
import { MostVisitedContactsCard } from '@/components/dashboard/home/most-visited-contacts-card';
import { getMostVisitedContacts } from '@/data/home/get-most-visited-contacts';
import type { NextPageProps } from '@/types/next-page-props';

export default async function MostVisitedContactsPage({
  searchParams
}: NextPageProps): Promise<React.JSX.Element> {
  searchParamsCache.parse(searchParams);

  const contacts = await getMostVisitedContacts({
    from: searchParamsCache.get('from'),
    to: searchParamsCache.get('to')
  });

  return (
    <MostVisitedContactsCard
      contacts={contacts}
      className="col-span-2 md:col-span-1"
    />
  );
}
