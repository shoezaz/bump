'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { MonitoringProvider } from '@workspace/monitoring/hooks/use-monitoring';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import { ThemeProvider } from '@workspace/ui/hooks/use-theme';

export function Providers({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <MonitoringProvider>
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <NiceModal.Provider>{children}</NiceModal.Provider>
          </TooltipProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </MonitoringProvider>
  );
}
