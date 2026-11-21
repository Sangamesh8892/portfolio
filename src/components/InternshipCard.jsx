'use client';

import CopyEmailButton from '@/components/dock/CopyEmailButton';
import { availability, profile } from '@/data/portfolio';
import { motion } from 'framer-motion';
import { CalendarDays, Code2, Globe } from 'lucide-react';

/** "Availability" card: what you're looking for right now. */
const InternshipCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-accent mx-auto mt-8 w-full max-w-4xl rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-muted h-16 w-16 overflow-hidden rounded-full shadow-md">
            <img
              src={profile.photo}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-semibold">
              {profile.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              {availability.heading}
            </p>
          </div>
        </div>

        {/* Live badge */}
        <div className="mt-4 flex items-center gap-2 sm:mt-0">
          <span className="flex items-center gap-1 rounded-full border border-green-500 px-3 py-0.5 text-sm font-medium text-green-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75 motion-reduce:animate-none"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            {availability.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-5 w-5 text-blue-500" />
          <div>
            <p className="text-foreground text-sm font-medium">When</p>
            <p className="text-muted-foreground text-sm">
              {availability.duration}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-1 h-5 w-5 text-green-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Location</p>
            <p className="text-muted-foreground text-sm">
              {availability.location}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 sm:col-span-2">
          <Code2 className="mt-1 h-5 w-5 text-purple-500" />
          <div className="w-full">
            <p className="text-foreground text-sm font-medium">Tech stack</p>
            <ul className="text-muted-foreground list-disc pl-4 text-sm">
              {availability.stack.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li>
                <a
                  href="/chat?query=What%20are%20your%20skills%3F&answer=skills"
                  className="cursor-pointer text-blue-500 underline"
                >
                  See more
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-foreground mb-2 text-lg font-semibold">
          What I bring
        </p>
        <p className="text-foreground text-sm">{availability.whatIBring}</p>
      </div>

      <div className="mt-8">
        <p className="text-foreground mb-2 text-lg font-semibold">Goal</p>
        <p className="text-foreground text-sm">{availability.goal}</p>
      </div>

      <div className="mt-10 flex justify-center">
        <CopyEmailButton label="Copy my email" />
      </div>
    </motion.div>
  );
};

export default InternshipCard;
