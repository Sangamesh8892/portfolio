'use client';

import React from 'react';
import CopyEmailButton from '@/components/dock/CopyEmailButton';
import { contact } from '@/data/portfolio';

export function Contact() {
  const contactInfo = contact;

  // Function to handle opening links
  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto mt-8 w-full">
      <div className="bg-accent w-full overflow-hidden rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
            Contacts
          </h2>
          {contactInfo.handle && <span className="mt-2 sm:mt-0">{contactInfo.handle}</span>}
        </div>

        {/* Email: copy only, never printed or linked */}
        <div className="mt-8 flex flex-col md:mt-10">
          <div className="mb-6">
            <CopyEmailButton />
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-5 sm:gap-x-8">
            {contactInfo.socials.map((social) => (
              <button
                key={social.name}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition-colors"
                onClick={() => openLink(social.url)}
                title={social.name}
              >
                {social.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
