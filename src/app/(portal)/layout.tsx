import type { Metadata } from 'next';

import { Navigation } from '@/app/(portal)/components/Navigation';

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
    <main>
      <Navigation />
      <div className="min-h-screen bg-secondary sm:ml-w-sidebar">
        {children}
      </div>
    </main>
  );
}
