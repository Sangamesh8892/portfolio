import React from 'react';

const TurboTitle = ({ text, className = '' }) => {
  return (
    <div className="flex flex-col">
      <span
        style={{ '--text': `'${text}'` }}
        className={`pointer-events-none relative overflow-hidden text-center font-mono text-[clamp(3rem,15vw,10rem)] font-medium tracking-tighter before:bg-gradient-to-b before:from-neutral-300 before:to-neutral-200/70 before:to-80% before:bg-clip-text before:text-transparent before:content-[var(--text)] after:absolute after:inset-0 after:bg-neutral-400/70 after:bg-clip-text after:text-transparent after:mix-blend-darken after:content-[var(--text)] after:[text-shadow:0_1px_0_white] dark:before:from-neutral-700/70 dark:before:to-neutral-800/30 dark:after:bg-neutral-600/70 dark:after:mix-blend-lighten dark:after:[text-shadow:0_1px_0_black] ${className}`}
      ></span>
    </div>
  );
};

export default TurboTitle;
