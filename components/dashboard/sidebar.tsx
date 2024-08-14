'use client';

import * as React from 'react';
import { ChevronLeftIcon, MenuIcon } from 'lucide-react';

import { FavoriteList } from '@/components/dashboard/favorite-list';
import { MainNav } from '@/components/dashboard/main-nav';
import { SupportNav } from '@/components/dashboard/support-nav';
import { UserDropdown } from '@/components/dashboard/user-dropdown';
import { Button } from '@/components/ui/button';
import { FillRemainingSpace } from '@/components/ui/fill-remaining-space';
import { Logo } from '@/components/ui/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MediaQueries } from '@/constants/media-queries';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import type { FavoriteDto } from '@/types/dtos/favorite-dto';
import type { ProfileDto } from '@/types/dtos/profile-dto';

export type SidebarProps = {
  favorites: FavoriteDto[];
  profile: ProfileDto;
};

export function Sidebar({
  favorites,
  profile
}: SidebarProps): React.JSX.Element {
  const xlUp = useMediaQuery(MediaQueries.XlUp, {
    ssr: true,
    fallback: true
  });
  const [showFullSidebar, setShowFullSidebar] = React.useState<boolean>(true);
  const isCollapsed = !xlUp || !showFullSidebar;
  const showLogo = !xlUp || showFullSidebar;
  const hideWordmark = !xlUp;
  const showSidebarToggle = xlUp;
  return (
    <ScrollArea className="hidden lg:block">
      <div
        className={cn(
          'flex h-screen flex-col gap-4 border-r px-3 pb-4',
          isCollapsed ? 'w-16 min-w-16 max-w-16' : 'w-60 min-w-60 max-w-60'
        )}
      >
        <SidebarHeader
          showLogo={showLogo}
          hideWordmark={hideWordmark}
          showSidebarToggle={showSidebarToggle}
          showFullSidebar={showFullSidebar}
          isCollapsed={isCollapsed}
          onChangeShowFullSidebar={setShowFullSidebar}
        />
        <SidebarContent>
          <MainNav isCollapsed={isCollapsed} />
          <FavoriteList
            favorites={favorites}
            isCollapsed={isCollapsed}
          />
          <FillRemainingSpace />
          <SupportNav
            profile={profile}
            isCollapsed={isCollapsed}
          />
        </SidebarContent>
        <SidebarFooter>
          <UserDropdown
            profile={profile}
            isCollapsed={isCollapsed}
          />
        </SidebarFooter>
      </div>
    </ScrollArea>
  );
}

type SidebarHeader = React.PropsWithChildren<{
  showLogo: boolean;
  hideWordmark: boolean;
  showSidebarToggle: boolean;
  showFullSidebar: boolean;
  isCollapsed: boolean;
  onChangeShowFullSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}>;
function SidebarHeader({
  showLogo,
  hideWordmark,
  showSidebarToggle,
  showFullSidebar,
  isCollapsed,
  onChangeShowFullSidebar
}: SidebarHeader): React.JSX.Element {
  const handleToggleSidebar = (): void => {
    onChangeShowFullSidebar((prev) => !prev);
  };
  return (
    <div
      className={cn(
        'flex h-16 shrink-0 items-center',
        isCollapsed
          ? 'w-9 min-w-9 max-w-9 justify-center'
          : 'w-full justify-between pl-2.5'
      )}
    >
      {showLogo && (
        <Logo
          hideWordmark={hideWordmark}
          className="justify-center xl:justify-between"
        />
      )}
      {showSidebarToggle && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-9 max-h-9 min-h-9 min-w-9 max-w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground group-hover:text-foreground"
          title={showFullSidebar ? 'Collapse' : 'Open'}
          onClick={handleToggleSidebar}
        >
          {showFullSidebar ? (
            <ChevronLeftIcon className="size-4 shrink-0" />
          ) : (
            <MenuIcon className="size-4 shrink-0" />
          )}
        </Button>
      )}
    </div>
  );
}

type SidebarContentProps = React.PropsWithChildren;
function SidebarContent(props: SidebarContentProps): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col gap-7 pt-3">{props.children}</div>
  );
}

type SidebarFooterProps = React.PropsWithChildren;
function SidebarFooter({ children }: SidebarFooterProps): React.JSX.Element {
  return <div className="flex w-full shrink-0 flex-col">{children}</div>;
}
