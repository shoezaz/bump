import * as React from 'react';
import ShadcnLogo from 'public/shadcn.svg';

import { AppInfo } from '@/constants/app-info';
import { cn } from '@/lib/utils';

export type LogoProps = React.HTMLAttributes<HTMLDivElement> & {
  hideSymbol?: boolean;
  hideWordmark?: boolean;
};

export function Logo({
  hideSymbol,
  hideWordmark,
  className,
  ...other
}: LogoProps): React.JSX.Element {
  return (
    <div
      className={cn('flex items-center space-x-2', className)}
      {...other}
    >
      {!hideSymbol && (
        <ShadcnLogo
          width={24}
          height={24}
        />
      )}
      {!hideWordmark && <span className="font-bold">{AppInfo.APP_NAME}</span>}
    </div>
  );
}
