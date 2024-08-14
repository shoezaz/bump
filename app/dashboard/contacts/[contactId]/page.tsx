import * as React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContactActionsDropdown } from '@/components/dashboard/contacts/details/contact-actions-dropdown';
import { ContactFavoriteToggle } from '@/components/dashboard/contacts/details/contact-favorite-toggle';
import { ContactMeta } from '@/components/dashboard/contacts/details/contact-meta';
import { ContactTabs } from '@/components/dashboard/contacts/details/contact-tabs';
import {
  Page,
  PageBack,
  PageBody,
  PageHeader,
  PagePrimaryBar,
  PageTitle
} from '@/components/ui/page';
import { Routes } from '@/constants/routes';
import { getProfile } from '@/data/account/get-profile';
import { getContact } from '@/data/contacts/get-contact';
import { getContactIsInFavorites } from '@/data/contacts/get-contact-is-in-favorites';
import { getContactNotes } from '@/data/contacts/get-contact-notes';
import { getContactTasks } from '@/data/contacts/get-contact-tasks';
import { getContactTimelineEvents } from '@/data/contacts/get-contact-timeline-events';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

type Params = {
  contactId?: string;
};

export async function generateMetadata({
  params
}: {
  params: Params;
}): Promise<Metadata> {
  const contactId = params.contactId;

  if (contactId) {
    const contact = await getContact({ id: contactId });
    if (contact) {
      return {
        title: createTitle(contact.name)
      };
    }
  }

  return {
    title: createTitle('Contact')
  };
}

export default async function ContactPage(
  props: NextPageProps & { params: Params }
): Promise<React.JSX.Element> {
  const contactId = props.params.contactId;
  if (!contactId) {
    return notFound();
  }

  const [profile, contact, addedToFavorites, tasks, events, notes] =
    await Promise.all([
      getProfile(),
      getContact({ id: contactId }),
      getContactIsInFavorites({ contactId }),
      getContactTasks({ contactId }),
      getContactTimelineEvents({ contactId }),
      getContactNotes({ contactId })
    ]);

  return (
    <Page>
      <PageHeader>
        <PagePrimaryBar>
          <div className="flex flex-row items-center gap-4">
            <PageBack href={Routes.Contacts} />
            <PageTitle>{contact.name}</PageTitle>
          </div>
          <div className="flex flex-row items-center gap-2">
            <ContactFavoriteToggle
              contact={contact}
              addedToFavorites={addedToFavorites}
            />
            <ContactActionsDropdown
              contact={contact}
              addedToFavorites={addedToFavorites}
            />
          </div>
        </PagePrimaryBar>
      </PageHeader>
      <PageBody
        disableScroll
        className="flex h-full flex-col overflow-auto md:flex-row md:divide-x md:overflow-hidden"
      >
        <ContactMeta contact={contact} />
        <ContactTabs
          profile={profile}
          contact={contact}
          tasks={tasks}
          events={events}
          notes={notes}
        />
      </PageBody>
    </Page>
  );
}
