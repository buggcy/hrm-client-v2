'use client';

import * as React from 'react';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTriggerLeftArrow = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center p-4 font-medium transition-all hover:text-primary [&[data-state=open]>svg]:rotate-90',
        className,
      )}
      {...props}
    >
      <ChevronRight className="mr-2 size-4 shrink-0 transition-transform duration-200" />
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTriggerLeftArrow.displayName = AccordionPrimitive.Trigger.displayName;

interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  hideIcon?: boolean;
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, hideIcon, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline focus:border-primary [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      {!hideIcon && (
        <ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content> & {
    wrapperClassName?: string;
  },
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    wrapperClassName?: string;
  }
>(({ className, wrapperClassName, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      wrapperClassName,
    )}
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export {
  Accordion,
  AccordionItem,
  AccordionTriggerLeftArrow,
  AccordionTrigger,
  AccordionContent,
};
