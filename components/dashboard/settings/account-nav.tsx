'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

import { NavItem } from '@/components/dashboard/nav-item';
import { accountNavItems } from '@/constants/nav-items';
import { cn } from '@/lib/utils';

export function AccountNav({
  className,
  ...other
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  const pathname = usePathname();
  return (
    <nav
      className={cn('grid items-start gap-1', className)}
      {...other}
    >
      {accountNavItems.map((item, index) => (
        <NavItem
          key={index}
          item={item}
          isActive={pathname.startsWith(item.href)}
        />
      ))}
    </nav>
  );
}
