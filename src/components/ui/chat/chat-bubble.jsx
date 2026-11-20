import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { Button } from '../button';
import MessageLoading from './message-loading';

// ChatBubble
const chatBubbleVariant = cva('flex gap-2 items-start relative group', {
  variants: {
    variant: {
      received: 'self-start w-full',
      sent: 'self-center flex-row-reverse mx-auto',
    },
    layout: {
      default: '',
      ai: 'max-w-full w-full items-center',
    },
  },
  defaultVariants: {
    variant: 'received',
    layout: 'default',
  },
});

const ChatBubble = React.forwardRef(
  ({ className, variant, layout, children, ...props }, ref) => (
    <div
      className={cn(
        chatBubbleVariant({ variant, layout, className }),
        'group relative'
      )}
      ref={ref}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && typeof child.type !== 'string'
          ? React.cloneElement(child, {
              variant,
              layout,
            })
          : child
      )}
    </div>
  )
);
ChatBubble.displayName = 'ChatBubble';

const ChatBubbleAvatar = ({ src, fallback, className, width, height }) => (
  <Avatar>
    <AvatarImage
      src={src}
      alt="Avatar"
      className={className}
      width={width}
      height={height}
    />
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
);

// ChatBubbleMessage
const chatBubbleMessageVariants = cva('', {
  variants: {
    variant: {
      received: 'text-secondary-foreground rounded-lg py-2',
      sent: 'p-2 px-5 bg-[#007AFF] text-primary-foreground rounded-3xl',
    },
    layout: {
      default: '',
      ai: 'border-t w-full rounded-none bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'received',
    layout: 'default',
  },
});

const ChatBubbleMessage = React.forwardRef(
  (
    { className, variant, layout, isLoading = false, children, ...props },
    ref
  ) => (
    <div
      className={cn(
        chatBubbleMessageVariants({ variant, layout, className }),
        'max-w-full break-words whitespace-pre-wrap'
      )}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading />
        </div>
      ) : (
        children
      )}
    </div>
  )
);
ChatBubbleMessage.displayName = 'ChatBubbleMessage';

const ChatBubbleTimestamp = ({ timestamp, className, ...props }) => (
  <div className={cn('mt-2 text-right text-xs', className)} {...props}>
    {timestamp}
  </div>
);

const ChatBubbleAction = ({
  icon,
  onClick,
  className,
  variant = 'ghost',
  size = 'icon',
  ...props
}) => (
  <Button
    variant={variant}
    size={size}
    className={className}
    onClick={onClick}
    {...props}
  >
    {icon}
  </Button>
);

const ChatBubbleActionWrapper = React.forwardRef(
  ({ variant, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'absolute top-1/2 flex -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100',
        variant === 'sent'
          ? '-left-1 -translate-x-full flex-row-reverse'
          : '-right-1 translate-x-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ChatBubbleActionWrapper.displayName = 'ChatBubbleActionWrapper';

export {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  chatBubbleMessageVariants,
  ChatBubbleTimestamp,
  chatBubbleVariant,
};
