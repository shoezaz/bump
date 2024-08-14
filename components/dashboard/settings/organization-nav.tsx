'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

import { NavItem } from '@/components/dashboard/nav-item';
import { organizationNavItems } from '@/constants/nav-items';
import { cn } from '@/lib/utils';

export type OrganizationNavProps = React.HTMLAttributes<HTMLDivElement>;

export function OrganizationNav({
  className,
  ...other
}: OrganizationNavProps): React.JSX.Element {
  const pathname = usePathname();
  return (
    <nav
      className={cn('grid items-start gap-1', className)}
      {...other}
    >
      <div className="h-8 px-3 text-sm font-semibold">Organization</div>
      {organizationNavItems.map((item, index) => (
        <NavItem
          key={index}
          item={item}
          isActive={pathname.startsWith(item.href)}
        />
      ))}
    </nav>
  );
}
