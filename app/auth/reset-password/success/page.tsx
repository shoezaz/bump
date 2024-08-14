import * as React from 'react';

import { ResetPasswordSuccessCard } from '@/components/auth/reset-password/reset-password-success-card';

export default function ResetPasswordSuccessPage(): React.JSX.Element {
  return (
    <div className="w-full min-w-[360px] px-2">
      <ResetPasswordSuccessCard className="mx-auto max-w-sm" />
    </div>
  );
}
