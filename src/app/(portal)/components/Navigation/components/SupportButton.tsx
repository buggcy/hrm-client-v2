import { usePathname, useRouter } from 'next/navigation';

import { CircleHelp } from 'lucide-react';

import { Button, ButtonProps } from '@/components/ui/button';
import { useStores } from '@/providers/Store.Provider';

import { AuthStoreType } from '@/stores/auth';
import { cn } from '@/utils';

export const NavigationSupportBtn = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (user?.roleId === 1) {
      router.push('/hr/support');
    } else if (user?.roleId === 2) {
      router.push('/employee/support');
    } else if (user?.roleId === 3) {
      router.push('/manager/support');
    }
  };
  return (
    <Button
      variant="ghost"
      className={cn(
        'h-10 w-full justify-start overflow-hidden pl-2.5 text-muted-foreground transition-all duration-200 group-hover:w-60 sm:size-10',
        {
          'bg-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary group-hover:w-60':
            pathname.includes('/support'),
        },
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <div className="flex w-52 items-center gap-2">
        <CircleHelp className="size-5" />
        <span className="transition-all duration-200 sm:translate-x-2 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
          {children || 'Support'}
        </span>
      </div>
    </Button>
  );
};

export const SupportButton = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const router = useRouter();

  const handleClick = () => {
    if (user?.roleId === 1) {
      router.push('/hr/support');
    } else if (user?.roleId === 2) {
      router.push('/employee/support');
    } else if (user?.roleId === 3) {
      router.push('/manager/support');
    }
  };

  return (
    <Button
      variant="outline"
      className={cn(
        'h-10 w-full justify-start overflow-hidden text-muted-foreground',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children || (
        <>
          <CircleHelp className="size-5" />
          Suppor
        </>
      )}
    </Button>
  );
};
