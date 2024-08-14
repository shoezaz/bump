import * as React from 'react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/nav-item';

export type NavItemProps = {
  item: NavItem;
  isActive: boolean;
  isCollapsed?: boolean;
};

export function NavItem({
  item,
  isActive,
  isCollapsed
}: NavItemProps): React.JSX.Element {
  return (
    <Link
      href={item.disabled ? '#' : item.href}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'default' }),
        'items-center',
        isActive ? 'bg-accent font-medium' : 'transparent font-normal',
        item.disabled && 'cursor-not-allowed opacity-80',
        isCollapsed
          ? 'size-9 max-h-9 min-h-9 min-w-9 max-w-9 justify-center'
          : 'justify-start gap-2 px-3'
      )}
      aria-disabled={item.disabled}
      target={item.external ? '_blank' : undefined}
    >
      <item.icon
        className={cn(
          'size-4 shrink-0',
          isActive ? 'text-foreground' : 'text-muted-foreground'
        )}
      />
      <span
        className={cn(
          'dark:text-muted-foreground',
          isActive && 'dark:text-foreground',
          isCollapsed && 'sr-only'
        )}
      >
        {item.title}
      </span>
    </Link>
  );
}
