'use client';

import * as React from 'react';
import { ActivityIcon, CheckSquare2Icon, FileIcon } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';

import { addContactPageVisit } from '@/actions/contacts/add-contact-page-visit';
import { ContactNotes } from '@/components/dashboard/contacts/details/notes/contact-notes';
import { ContactTasks } from '@/components/dashboard/contacts/details/tasks/contact-tasks';
import { ContactActivity } from '@/components/dashboard/contacts/details/timeline/contact-activity';
import { Separator } from '@/components/ui/separator';
import {
  UnderlinedTabs,
  UnderlinedTabsContent,
  UnderlinedTabsList,
  UnderlinedTabsTrigger
} from '@/components/ui/tabs';
import { useRunOnce } from '@/hooks/use-run-once';
import type { ContactDto } from '@/types/dtos/contact-dto';
import type { ContactNoteDto } from '@/types/dtos/contact-note-dto';
import type { ContactTaskDto } from '@/types/dtos/contact-task-dto';
import type { ProfileDto } from '@/types/dtos/profile-dto';
import type { TimelineEventDto } from '@/types/dtos/timeline-event-dto';

enum Tab {
  Activity = 'activity',
  Notes = 'notes',
  Tasks = 'tasks'
}

const tabList = [
  {
    icon: ActivityIcon,
    label: 'Activity',
    value: Tab.Activity
  },
  {
    icon: FileIcon,
    label: 'Notes',
    value: Tab.Notes
  },
  {
    icon: CheckSquare2Icon,
    label: 'Tasks',
    value: Tab.Tasks
  }
];

export type ContactTabsProps = {
  profile: ProfileDto;
  contact: ContactDto;
  tasks: ContactTaskDto[];
  events: TimelineEventDto[];
  notes: ContactNoteDto[];
};

export function ContactTabs({
  profile,
  contact,
  tasks,
  events,
  notes
}: ContactTabsProps): React.JSX.Element {
  const [tab, setTab] = useQueryState<string>(
    'tab',
    parseAsString.withDefault(Tab.Activity)
  );
  useRunOnce(() => addContactPageVisit({ contactId: contact.id }));
  return (
    <UnderlinedTabs
      value={tab}
      onValueChange={setTab}
      className="flex size-full flex-col"
    >
      <UnderlinedTabsList className="h-12 max-h-12 min-h-12 gap-x-2 overflow-x-auto border-none px-4">
        {tabList.map((item) => (
          <UnderlinedTabsTrigger
            key={item.value}
            value={item.value}
            className="mx-0 border-t-4 border-t-transparent"
          >
            <div className="flex flex-row items-center gap-2 rounded-md px-2 py-1 hover:bg-accent">
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </div>
          </UnderlinedTabsTrigger>
        ))}
      </UnderlinedTabsList>
      <Separator />
      <UnderlinedTabsContent
        value={Tab.Activity}
        className="m-0 p-0 md:grow md:overflow-hidden"
      >
        <ContactActivity
          profile={profile}
          contact={contact}
          events={events}
        />
      </UnderlinedTabsContent>
      <UnderlinedTabsContent
        value={Tab.Notes}
        className="m-0 p-0 md:grow md:overflow-hidden"
      >
        <ContactNotes
          contact={contact}
          notes={notes}
        />
      </UnderlinedTabsContent>
      <UnderlinedTabsContent
        value={Tab.Tasks}
        className="m-0 p-0 md:grow md:overflow-hidden"
      >
        <ContactTasks
          contact={contact}
          tasks={tasks}
        />
      </UnderlinedTabsContent>
    </UnderlinedTabs>
  );
}
