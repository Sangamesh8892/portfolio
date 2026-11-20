'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Square } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

export default function ChatBottombar({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full pb-2 md:pb-5"
    >
      <form onSubmit={handleSubmit} className="relative w-full md:px-4">
        <div className="mx-auto flex items-center rounded-full border border-[#E5E5E9] bg-[#ECECF0] py-2 pr-2 pl-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything"
            aria-label="Ask me anything"
            className="text-md w-full border-none bg-transparent text-black placeholder:text-gray-500 focus:outline-none"
          />

          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Skip animation"
              className="flex items-center justify-center rounded-full bg-[#0171E3] p-2 text-white"
            >
              <Square className="h-6 w-6 p-1" fill="currentColor" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="flex items-center justify-center rounded-full bg-[#0171E3] p-2 text-white disabled:opacity-50"
            >
              <ArrowUp className="h-6 w-6" />
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
