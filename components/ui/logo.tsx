import * as React from 'react';

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 64 64"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M16.267 46.389l7.998-7.128h16.25l6.231 19.491-30.48-12.363zM5.072 21.666l14.863 1.686v14.04c0 .136.017.27.048.397l-7.076 6.305-7.835-22.428zm14.863-2.084L6.607 18.071 19.935 6.197v13.385zm29.283-9.21L36.886 21.507l-12.755-1.448V4.313l25.087 6.06zM24.13 35.523V23.828l11.882 1.347 3.308 10.347H24.13zm35.028 0H43.684l-3.68-11.509 12.28-11.087 6.875 22.596zM50.4 56.531L44.88 39.26H58.64l-8.24 17.27zm13.527-19.628L55.425 8.956c-.195-.64-.757-1.142-1.476-1.316L22.58.065a2.3 2.3 0 00-1.823.32c-.035.023-.065.05-.098.075L20.55.36.615 18.122l.002.002c-.043.039-.087.077-.127.119C.032 18.73-.118 19.392.095 20l9.463 27.09c.178.508.59.925 1.134 1.146l38.446 15.596a2.313 2.313 0 002.238-.285c.25-.19.436-.428.56-.687l.003.002 11.594-24.298c.011-.013.025-.023.035-.036a1.71 1.71 0 00.36-1.625z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {!hideWordmark && <span className="font-bold">{AppInfo.APP_NAME}</span>}
    </div>
  );
}
