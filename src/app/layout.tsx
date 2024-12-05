import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import '@/libs/i18n';

import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, QueryClientProvider, ThemeProvider } from '@/providers';
import { StoreProvider } from '@/providers/Store.Provider';

import { cn } from '@/utils';

import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});
export const metadata: Metadata = {
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
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <NextTopLoader color="#30bbf2" height={6} />
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
      </body>
    </html>
  );
}
