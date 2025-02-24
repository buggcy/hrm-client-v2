'use client';
import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import '@/libs/i18n';

import InitialLoader from '@/components/Loader/initialLoader';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, QueryClientProvider, ThemeProvider } from '@/providers';
import { StoreProvider } from '@/providers/Store.Provider';

import { cn } from '@/utils';

import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});
const metadata: Metadata = {
  title: 'Buggcy',
  description: 'Developer portal',
};

export const viewport = {
  themeColor: '#F230AB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <html lang="en">
      <head>
        <title>{String(metadata.title) || 'Buggcy'}</title>
        <meta
          name="description"
          content={metadata.description || 'Developer portal'}
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="/images/buggcy/logo-buggcy-small.png"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        {isLoading ? (
          <InitialLoader />
        ) : (
          <>
            <NextTopLoader color="#30bbf2" height={4} showSpinner={false} />
            <QueryClientProvider>
              <StoreProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem
                  disableTransitionOnChange
                >
                  <AuthProvider>{children}</AuthProvider>
                </ThemeProvider>
              </StoreProvider>
            </QueryClientProvider>
            <Toaster />
          </>
        )}
      </body>
    </html>
  );
}
