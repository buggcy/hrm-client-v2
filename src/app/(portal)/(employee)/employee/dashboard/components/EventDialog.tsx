import React from 'react';

import { BookImage, Calendar, Tag } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { EventData } from '@/types/events.types';

import './ViewEvent.css';

interface ViewEventDialogProps {
  event?: EventData;
  onOpenChange: () => void;
  onCloseChange?: () => void;
  open: boolean;
}

export function EventDialog({
  event,
  onOpenChange,
  open,
}: ViewEventDialogProps) {
  const formatDate = (dateInput?: string | Date): string => {
    if (!dateInput) return 'Invalid date';

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[550px] flex-col p-6 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
        </DialogHeader>
        <DialogDescription className="dark:text-gray-300">
          <div className="flex flex-col gap-3">
            <div className="flex h-fit justify-between">
              <div className="grid h-fit w-full gap-4 pt-4 text-left">
                <div className="grid h-fit w-full grid-cols-1 max-sm:gap-3 sm:grid-cols-2">
                  <div className="flex space-x-3 max-sm:justify-between">
                    <div className="flex gap-3">
                      <BookImage className="size-4 text-blue-500" />
                      <span className="text-sm font-medium text-black dark:text-white">
                        Event Name:
                      </span>
                    </div>
                    <p className="text-sm">{event?.title || ''}</p>
                  </div>
                  <div className="flex space-x-3 max-sm:justify-between">
                    <div className="flex gap-3">
                      <Tag className="size-4 text-blue-500" />
                      <span className="text-sm font-medium text-black dark:text-white">
                        Type:
                      </span>
                    </div>
                    <p className="text-sm">
                      {event?.type === 'company' ? 'Non Holiday' : 'Holiday'}
                    </p>
                  </div>
                </div>

                <div className="grid h-fit grid-cols-1 max-sm:gap-3 sm:grid-cols-2">
                  <div className="flex space-x-3 max-sm:justify-between">
                    <div className="flex gap-3">
                      <Calendar className="size-4 text-blue-500" />
                      <span className="text-sm font-medium text-black dark:text-white">
                        Start Date:
                      </span>
                    </div>
                    <p className="text-sm">{formatDate(event?.start)}</p>
                  </div>
                  <div className="flex space-x-3 max-sm:justify-between">
                    <div className="flex gap-3">
                      <Calendar className="size-4 text-blue-500" />
                      <span className="text-sm font-medium text-black dark:text-white">
                        End Date:
                      </span>
                    </div>
                    <p className="text-sm">{formatDate(event?.end)}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <span className="text-sm font-medium text-black dark:text-white">
                    Description:
                  </span>
                  <div className="description-content max-h-60 overflow-y-auto rounded-md bg-muted/70 p-4 text-sm">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: event?.Event_Discription || '',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
