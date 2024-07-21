import Image from 'next/image';

export function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex h-full flex-col justify-between gap-16 p-10">
        <Image
          src="/images/logo_full.svg"
          alt="Tavus Logo"
          width={84}
          height={32}
          priority
        />
        <div className="mx-auto grid w-full max-w-sm gap-6">{children}</div>
        <div></div>
      </div>
      <div className="hidden h-screen bg-muted lg:block">
        <img
          src="/images/bcg_auth_page.png"
          alt="Image"
          className="size-full object-cover object-left dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
