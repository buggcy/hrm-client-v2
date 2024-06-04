import { FC } from 'react';

import { Separator } from '@/components/ui/separator';

import { cn } from '@/utils';

export const NavSection: FC<{
  title?: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <section>
      <div className="mb-1 flex h-5 w-full items-center gap-1 pl-2.5 sm:w-52 sm:pl-0">
        <Separator
          className={cn('mx-1 hidden w-full sm:block sm:transition-all', {
            'sm:w-8 sm:group-hover:-translate-x-8 sm:group-hover:opacity-0':
              title,
            'block sm:w-8 sm:group-hover:w-52': !title,
          })}
        />
        {title && (
          <h3 className="text-[0.625rem] leading-5 tracking-wide sm:translate-x-2 sm:opacity-0 sm:transition-all sm:group-hover:-translate-x-8 sm:group-hover:opacity-100">
            {title}
          </h3>
        )}
      </div>
      <ul className="flex flex-col gap-1">{children}</ul>
    </section>
  );
};
