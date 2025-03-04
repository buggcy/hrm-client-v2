import Image from 'next/image';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface AuthLayoutProps {
  children: React.ReactNode;
  maxWidth?: boolean;
}

export function AuthLayout({
  children,
  maxWidth = true,
}: Readonly<AuthLayoutProps>) {
  return (
    <div className="min-h-screen w-full">
      <ScrollArea className="h-screen w-full">
        <div className="flex h-full flex-col justify-between gap-16 p-10">
          <Image
            src="/images/buggcy/logo-buggcy.svg"
            alt="Buggcy Logo"
            width={120}
            height={40}
            priority
          />
          <div
            className={`grid gap-6 ${maxWidth ? 'mx-auto w-full max-w-sm' : ''}`}
          >
            {children}
          </div>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
