export function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid max-w-sm gap-6">{children}</div>
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
