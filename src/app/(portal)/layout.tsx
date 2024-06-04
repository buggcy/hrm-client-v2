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
      <div className="min-h-screen p-5 sm:ml-w-sidebar sm:p-8">{children}</div>
    </main>
  );
}
