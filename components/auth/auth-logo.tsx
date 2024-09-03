import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const containerVariants = cva('w-full min-w-[360px] mx-auto space-y-6', {
  variants: {
    maxWidth: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg'
    }
  },
  defaultVariants: {
    maxWidth: 'sm'
  }
});

export type AuthContainerProps = React.PropsWithChildren &
  VariantProps<typeof containerVariants>;

export function AuthContainer({
  maxWidth,
  children
}: AuthContainerProps): React.JSX.Element {
  return <div className={containerVariants({ maxWidth })}>{children}</div>;
}
