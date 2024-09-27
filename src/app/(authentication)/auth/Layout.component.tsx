import Image from 'next/image';

export function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <div className="mx-auto grid w-full max-w-sm gap-6">{children}</div>
      </div>
    </div>
  );
}
