import * as React from 'react';

import { AccountNav } from '@/components/dashboard/settings/account-nav';
import { OrganizationNav } from '@/components/dashboard/settings/organization-nav';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SettingsSidebar(): React.JSX.Element {
  return (
    <ScrollArea className="hidden lg:block">
      <div className="flex h-screen w-60 min-w-60 max-w-60 flex-col border-r px-3 pb-4">
        <SettingsSidebarHeader />
        <SettingsSidebarContent>
          <AccountNav />
          <OrganizationNav />
        </SettingsSidebarContent>
      </div>
    </ScrollArea>
  );
}

function SettingsSidebarHeader(): React.JSX.Element {
  return (
    <div className="flex h-16 shrink-0 items-center px-3">
      <div className="font-semibold">Settings</div>
    </div>
  );
}

function SettingsSidebarContent(
  props: React.PropsWithChildren
): React.JSX.Element {
  return <div className="flex flex-1 flex-col gap-7">{props.children}</div>;
}
