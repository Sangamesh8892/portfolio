'use client';

import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { motion } from 'framer-motion';
import ChatMessageContent from './chat-message-content';
import CardRenderer from './tool-renderer';

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

/** One scripted answer: its card on top, the typed-out reply below. */
export function SimplifiedChatView({ reply }) {
  return (
    <motion.div {...MOTION_CONFIG} className="flex h-full w-full flex-col px-4">
      <div className="custom-scrollbar flex h-full w-full flex-col overflow-y-auto">
        {reply.card && (
          <div className="mb-4 w-full">
            <CardRenderer card={reply.card} />
          </div>
        )}

        {reply.text.length > 0 && (
          <div className="w-full">
            <ChatBubble variant="received" className="w-full">
              <ChatBubbleMessage className="w-full">
                <ChatMessageContent content={reply.text} />
              </ChatBubbleMessage>
            </ChatBubble>
          </div>
        )}

        <div className="pb-4" />
      </div>
    </motion.div>
  );
}
