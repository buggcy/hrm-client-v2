import type { Metadata } from 'next';

import { Sidebar } from '@/app/(portal)/components/Sidebar';

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
      <Sidebar />
      <div className="min-h-screen p-5 sm:ml-w-sidebar sm:p-8">{children}</div>
    </main>
  );
}
