import type { Metadata } from 'next';

import { Intercom } from '@/components/Intercom';

import { Navigation } from '@/app/(portal)/components/Navigation';

export const metadata: Metadata = {
  title: 'Buggcy',
  description: 'Developer portal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Navigation />
      <div className="min-h-screen bg-secondary-foreground sm:ml-w-sidebar">
        {children}
      </div>
      <Intercom />
    </main>
  );
}
