import { FC } from 'react';

import { cn } from '@/utils';

import { LayoutBaseProps, LayoutHeaderProps } from './types';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const Layout: FC<LayoutBaseProps> = ({ children, className }) => {
  return (
    <div data-testid="layout" className={cn('min-h-screen', className)}>
      <ScrollArea className="h-[calc(100vh-4rem)] w-full sm:h-[calc(100vh-1rem)]">
        <div className="max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-4rem)]">
          {children}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};

const LayoutHeader: FC<LayoutHeaderProps> = ({
  title,
  children,
  leftElement,
  className,
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 hidden items-center bg-background p-3 sm:flex sm:px-8',
        className,
      )}
    >
      {leftElement && <div className="mr-3">{leftElement}</div>}
      <h1 className="mr-5 hidden text-xl font-semibold sm:block">{title}</h1>
      {children}
    </header>
  );
};

const LayoutHeaderButtonsBlock: FC<LayoutBaseProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('ml-auto flex items-center gap-2', className)}>
      {children}
    </div>
  );
};

const LayoutWrapper: FC<LayoutBaseProps> = ({
  children,
  className,
  wrapperClassName,
}) => {
  return (
    <div className={cn('p-5 sm:p-6 xl:p-8', wrapperClassName)}>
      <div
        data-testid="layout-wrapper"
        className={cn('mx-auto w-full max-w-screen-xl', className)}
      >
        {children}
      </div>
    </div>
  );
};

export { Layout, LayoutHeader, LayoutWrapper, LayoutHeaderButtonsBlock };
