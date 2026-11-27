'use client';

import DockSheet from '@/components/dock/DockSheet';
import GlassDock from '@/components/dock/GlassDock';
import SiteNav from '@/components/site/SiteNav';
import About from '@/components/story/About';
import AgentChapters from '@/components/story/AgentChapters';
import AgentGrid from '@/components/story/AgentGrid';
import Close from '@/components/story/Close';
import Experience from '@/components/story/Experience';
import Hero from '@/components/story/Hero';
import SmoothScroll from '@/components/story/SmoothScroll';

/** The landing page is one scroll story; quick facts live in the dock. */
export default function Home() {
  return (
    <SmoothScroll>
      <div className="landing">
        <header className="nav-wrap">
          <SiteNav />
        </header>
        <Hero />
        <About />
        <AgentChapters />
        <AgentGrid />
        <Experience />
        <Close />
      </div>
      <GlassDock />
      <DockSheet />
    </SmoothScroll>
  );
}
