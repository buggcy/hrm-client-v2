import Image from 'next/image';

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
      <div className="flex h-full flex-col justify-between gap-16 p-10">
        <Image
          src="/images/buggcy/logo-buggcy.svg"
          alt="Buggcy Logo"
          width={120}
          height={40}
          priority
        />
        <div
          className={`mx-auto grid gap-6 ${maxWidth ? 'w-full max-w-sm' : ''}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
