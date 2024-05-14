import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import '@/libs/analytics';

import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, QueryClientProvider } from '@/providers';

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
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
