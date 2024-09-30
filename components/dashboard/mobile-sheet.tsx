'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftIcon, MenuIcon } from 'lucide-react';

import { FavoriteList } from '@/components/dashboard/favorite-list';
import { MainNav } from '@/components/dashboard/main-nav';
import { AccountNav } from '@/components/dashboard/settings/account-nav';
import { OrganizationNav } from '@/components/dashboard/settings/organization-nav';
import { SupportNav } from '@/components/dashboard/support-nav';
import { UserDropdown } from '@/components/dashboard/user-dropdown';
import { Button, buttonVariants } from '@/components/ui/button';
import { FillRemainingSpace } from '@/components/ui/fill-remaining-space';
import { Logo } from '@/components/ui/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MediaQueries } from '@/constants/media-queries';
import { Routes } from '@/constants/routes';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import type { FavoriteDto } from '@/types/dtos/favorite-dto';
import type { ProfileDto } from '@/types/dtos/profile-dto';

export type MobileSheetProps = {
  profile: ProfileDto;
  favorites: FavoriteDto[];
};

export function MobileSheet({
  profile,
  favorites
}: MobileSheetProps): React.JSX.Element {
  const lgUp = useMediaQuery(MediaQueries.LgUp, { ssr: true, fallback: true });
  const [open, setOpen] = React.useState<boolean>(false);
  const pathname = usePathname();
  const isSettingsRoute = pathname.startsWith(Routes.Settings);
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);
  if (lgUp) {
    return <></>;
  }
  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="fixed left-4 top-4 z-30 size-8 lg:hidden"
        >
          <MenuIcon className="size-4 shrink-0" />
        </Button>
      </SheetTrigger>
      <SheetContent
        hideClose
        side="left"
        className="h-full w-60 min-w-60 max-w-60 p-0"
      >
        {isSettingsRoute ? (
          <SettingsMenu />
        ) : (
          <MainMenu
            profile={profile}
            favorites={favorites}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

export type MainMenuProps = {
  profile: ProfileDto;
  favorites: FavoriteDto[];
};

function MainMenu({ profile, favorites }: MainMenuProps): React.JSX.Element {
  return (
    <ScrollArea className="h-full [&>div>div]:h-full">
      <div className="flex h-full flex-col gap-4 px-3 pb-4">
        <div className="flex h-16 shrink-0 flex-row items-center pl-0.5">
          <Logo />
        </div>
        <div className="flex flex-1 flex-col gap-4 pt-3">
          <MainNav />
          <FavoriteList favorites={favorites} />
          <FillRemainingSpace />
          <SupportNav profile={profile} />
        </div>
        <div className="flex w-full shrink-0 flex-col">
          <UserDropdown profile={profile} />
        </div>
      </div>
    </ScrollArea>
  );
}

function SettingsMenu(): React.JSX.Element {
  return (
    <ScrollArea className="h-full">
      <div className="flex h-full flex-col justify-between px-3 pb-4">
        <div className="flex h-16 shrink-0 flex-row items-center gap-1.5">
          <Link
            href={Routes.Home}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'text-muted-foreground'
            )}
          >
            <ArrowLeftIcon className="size-4 shrink-0" />
          </Link>
          <span className="text-base font-semibold">Settings</span>
        </div>
        <div className="flex flex-col gap-7">
          <AccountNav />
          <OrganizationNav />
        </div>
      </div>
    </ScrollArea>
  );
}
