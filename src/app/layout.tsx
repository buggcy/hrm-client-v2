import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { GoogleAnalytics } from '@next/third-parties/google';
import '@/libs/analytics';
import '@/libs/i18n';

import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, QueryClientProvider, ThemeProvider } from '@/providers';

import { GA_ID } from '@/constants';
import { cn } from '@/utils';

import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});
export const metadata: Metadata = {
  title: 'Tavus',
  description: 'Developer portal',
};

export const viewport = {
  // TODO: change to variable
  themeColor: '#F230AB',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <QueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        <Toaster />
      </body>
    </html>
  );
}
