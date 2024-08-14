import * as React from 'react';

import { searchParamsCache } from '@/components/dashboard/home/home-search-params';
import { LeadGenerationCard } from '@/components/dashboard/home/lead-generation-card';
import { getLeadGenerationData } from '@/data/home/get-lead-generation-data';
import type { NextPageProps } from '@/types/next-page-props';

export default async function LeadGenerationPage({
  searchParams
}: NextPageProps): Promise<React.JSX.Element> {
  searchParamsCache.parse(searchParams);

  const data = await getLeadGenerationData({
    from: searchParamsCache.get('from'),
    to: searchParamsCache.get('to')
  });

  return <LeadGenerationCard data={data} />;
}
