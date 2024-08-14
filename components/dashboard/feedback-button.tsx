import * as React from 'react';
import { FeedbackModal } from '@//components/dashboard/feedback-modal';
import NiceModal from '@ebay/nice-modal-react';
import { MessageCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

export type FeedbackButtonProps = {
  isCollapsed?: boolean;
};

export function FeedbackButton({
  isCollapsed
}: FeedbackButtonProps): React.JSX.Element {
  const handleShowFeedbackModal = (): void => {
    NiceModal.show(FeedbackModal);
  };

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="default"
            variant="ghost"
            className="size-9 max-h-9 min-h-9 min-w-9 max-w-9 items-center justify-center font-normal text-muted-foreground"
            onClick={handleShowFeedbackModal}
          >
            <MessageCircleIcon className="size-4 shrink-0" />
            <span className="sr-only">Feedback</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Feedback</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button
      type="button"
      size="default"
      variant="ghost"
      className="w-full items-center justify-start gap-2 px-3 py-2 font-normal text-muted-foreground"
      onClick={handleShowFeedbackModal}
    >
      <MessageCircleIcon className="size-4 shrink-0" />
      <span>Feedback</span>
    </Button>
  );
}
