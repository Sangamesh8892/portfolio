import React, { forwardRef } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ButtonWithTooltip = forwardRef(({ children, side, toolTipText }, ref) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {React.isValidElement(children) &&
            // @ts-ignore
            React.cloneElement(children, { ref: ref })}
        </TooltipTrigger>
        <TooltipContent side={side}>
          <div>{toolTipText}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

ButtonWithTooltip.displayName = 'ButtonWithTooltip';

export default ButtonWithTooltip;
