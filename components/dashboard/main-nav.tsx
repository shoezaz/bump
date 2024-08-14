'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

import { NavItem } from '@/components/dashboard/nav-item';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { mainNavItems } from '@/constants/nav-items';
import { cn } from '@/lib/utils';

export type MainNavProps = React.HTMLAttributes<HTMLDivElement> & {
  isCollapsed?: boolean;
};

export function MainNav({
  isCollapsed,
  className,
  ...other
}: MainNavProps): React.JSX.Element {
  const pathname = usePathname();
  return (
    <nav
      className={cn('grid items-start gap-1', className)}
      {...other}
    >
      {mainNavItems.map((item, index) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <React.Fragment key={index}>
            {isCollapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger
                  className={
                    isCollapsed
                      ? 'size-9 max-h-9 min-h-9 min-w-9 max-w-9'
                      : 'w-full'
                  }
                >
                  <NavItem
                    item={item}
                    isActive={isActive}
                    isCollapsed={isCollapsed}
                  />
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            ) : (
              <NavItem
                item={item}
                isActive={isActive}
                isCollapsed={isCollapsed}
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
