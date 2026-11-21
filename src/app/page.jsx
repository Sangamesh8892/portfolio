'use client';

import DockSheet from '@/components/dock/DockSheet';
import GlassDock from '@/components/dock/GlassDock';
import SiteNav from '@/components/site/SiteNav';
import About from '@/components/story/About';
import Close from '@/components/story/Close';
import Experience from '@/components/story/Experience';
import Hero from '@/components/story/Hero';
import MvpPipeline from '@/components/story/MvpPipeline';
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
        <MvpPipeline />
        <Experience />
        <Close />
      </div>
      <GlassDock />
      <DockSheet />
    </SmoothScroll>
  );
}
