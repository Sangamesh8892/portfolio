import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { profile, site } from '@/data/portfolio';
import './globals.css';

// Load Inter font for non-Apple devices
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: site.title,
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.title,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    creator: site.twitterHandle,
  },
  icons: {
    icon: [{ url: '/favicon.svg', sizes: 'any' }],
    shortcut: '/favicon.svg?v=2',
    apple: '/apple-touch-icon.svg?v=2',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body
        className={cn(
          'bg-background min-h-screen font-sans antialiased',
          inter.variable
        )}
      >
        <main className="flex min-h-screen flex-col">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
