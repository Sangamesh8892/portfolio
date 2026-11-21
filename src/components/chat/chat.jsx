'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import ChatMessageContent from '@/components/chat/chat-message-content';
import MercuryToggle from '@/components/site/MercuryToggle';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import WelcomeModal from '@/components/welcome-modal';
import { hero } from '@/data/portfolio';
import { findAnswer, getAnswerById } from '@/lib/scripted-chat';
import HelperBoost from './HelperBoost';

/* ── timing of the scripted reply ── */
const THINKING_MS = 700; // "typing…" bubble before the answer appears
const WORD_MS = 35; // delay between revealed words

// Client-only: picks a still image on iOS/Safari (no transparent webm support).
const Avatar = dynamic(
  () =>
    Promise.resolve(({ hasActiveTool, videoRef }) => {
      const ua = window.navigator.userAgent;
      const useStill =
        /iPad|iPhone|iPod/.test(ua) ||
        (window.navigator.platform === 'MacIntel' &&
          window.navigator.maxTouchPoints > 1) ||
        (/Safari/.test(ua) && !/Chrome/.test(ua));

      return (
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
        >
          <div
            className="relative cursor-pointer"
            onClick={() => (window.location.href = '/')}
          >
            {useStill ? (
              <img
                src={hero.avatarImage}
                alt="Avatar"
                className="h-full w-full scale-[1.8] object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                className="h-full w-full scale-[1.8] object-contain"
                muted
                playsInline
                loop
              >
                <source src={hero.avatarVideoWebm} type="video/webm" />
                <source src={hero.avatarVideoMp4} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      );
    }),
  { ssr: false }
);

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Chat = () => {
  const videoRef = useRef(null);
  const timers = useRef([]);
  const fullText = useRef('');
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');
  const initialAnswerId = searchParams.get('answer');
  const openMore = searchParams.get('more') === '1';

  const [userMessage, setUserMessage] = useState(null);
  const [reply, setReply] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const isBusy = isThinking || isTalking;
  const hasActiveTool = Boolean(reply?.card);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const finishTalking = useCallback(() => {
    clearTimers();
    setIsThinking(false);
    setIsTalking(false);
    setReply((r) => (r ? { ...r, text: fullText.current } : r));
  }, []);

  const submitQuery = useCallback(
    (query, answerId) => {
      if (!query.trim() || isBusy) return;
      const answer = answerId ? getAnswerById(answerId) : findAnswer(query);
      fullText.current = answer.reply;

      clearTimers();
      setUserMessage(query);
      setReply(null);
      setIsThinking(true);

      const think = setTimeout(() => {
        setIsThinking(false);
        if (prefersReducedMotion()) {
          setReply({ card: answer.card, text: answer.reply });
          return;
        }
        setReply({ card: answer.card, text: '' });
        setIsTalking(true);

        // Reveal the reply word by word, keeping the original spacing.
        const words = answer.reply.split(/(\s+)/);
        let shown = '';
        words.forEach((word, i) => {
          const t = setTimeout(() => {
            shown += word;
            setReply({ card: answer.card, text: shown });
            if (i === words.length - 1) setIsTalking(false);
          }, i * WORD_MS);
          timers.current.push(t);
        });
      }, THINKING_MS);
      timers.current.push(think);
    },
    [isBusy]
  );

  // Deep links: /chat?query=...  or  /chat?query=...&answer=<answerId>
  const autoSubmitted = useRef(false);
  useEffect(() => {
    if (initialQuery && !autoSubmitted.current) {
      autoSubmitted.current = true;
      submitQuery(initialQuery, initialAnswerId ?? undefined);
    }
  }, [initialQuery, initialAnswerId, submitQuery]);

  // The avatar video plays only while the reply is being "spoken".
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isTalking) video.play().catch(() => {});
    else video.pause();
  }, [isTalking]);

  useEffect(() => clearTimers, []);

  const isEmptyState = !userMessage;
  const headerHeight = hasActiveTool ? 100 : 180;

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute top-5 right-4 z-51 flex items-center gap-2 md:top-6 md:right-8">
        <WelcomeModal
          trigger={
            <div
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full hover:bg-[var(--hover-bg)]"
              aria-label="About this portfolio"
            >
              <Info className="h-6 w-6 text-[var(--ink-soft)]" />
            </div>
          }
        />
        <MercuryToggle />
      </div>

      {/* Fixed Avatar Header, fading into the shared background */}
      <div className="chat-fade-top fixed top-0 right-0 left-0 z-50">
        <div
          className={`transition-all duration-300 ease-in-out ${hasActiveTool ? 'pt-6 pb-0' : 'py-6'}`}
        >
          <div className="flex justify-center">
            <Avatar hasActiveTool={hasActiveTool} videoRef={videoRef} />
          </div>

          <AnimatePresence>
            {userMessage && !reply && (
              <motion.div
                {...MOTION_CONFIG}
                className="mx-auto flex max-w-3xl px-4"
              >
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent content={userMessage} />
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        <div
          className="flex-1 overflow-y-auto px-2"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          <AnimatePresence mode="wait">
            {isEmptyState ? null : reply ? (
              <div key={userMessage} className="pb-4">
                <SimplifiedChatView reply={reply} />
              </div>
            ) : (
              isThinking && (
                <motion.div
                  key="loading"
                  {...MOTION_CONFIG}
                  className="px-4 pt-18"
                >
                  <ChatBubble variant="received">
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="chat-fade-bottom sticky bottom-0 px-2 pt-8 pb-4 md:px-0 md:pb-6">
          <div className="relative flex flex-col items-center gap-3">
            <AnimatePresence>
              {isBusy && (
                <motion.button
                  key="skip"
                  type="button"
                  onClick={finishTalking}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="chip glass px-4 py-2 text-sm"
                >
                  Skip to the answer
                </motion.button>
              )}
            </AnimatePresence>
            <HelperBoost submitQuery={submitQuery} defaultOpen={openMore} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
