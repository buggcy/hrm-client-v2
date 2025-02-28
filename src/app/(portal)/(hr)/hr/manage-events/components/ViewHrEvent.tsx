import React from 'react';

import { BookImage, Calendar, Tag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import { HrEventsListType } from '@/libs/validations/employee';

import './ViewHrEvent.css';

interface EventDetailsCardProps {
  event: HrEventsListType;
  open: boolean;
  onCloseChange?: () => void;
  onOpenChange: () => void;
}

export function ViewHrEvent({
  event,
  open,
  onOpenChange,
}: EventDetailsCardProps) {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Invalid date';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const variant = event?.isEnabled ? 'success' : 'destructive';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[550px] flex-col p-6 max-sm:max-h-[600px] sm:max-w-[600px]">
        <div className="flex flex-col gap-3">
          <div className="flex h-fit justify-between pr-5">
            <div className="h-fit text-left text-xl font-semibold">
              Event Details
            </div>
            <div className="h-fit text-left text-xl font-semibold">
              <Badge variant={variant}>
                {event?.isEnabled ? 'Enable' : 'Disabled'}
              </Badge>
            </div>
          </div>
          <div className="grid h-fit gap-4 pt-4 text-left">
            <div className="grid h-fit grid-cols-1 max-sm:gap-3 sm:grid-cols-2">
              <div className="flex space-x-3 max-sm:justify-between">
                <div className="flex gap-3">
                  <BookImage className="size-4 text-blue-500" />
                  <span className="text-sm font-medium">Event Name:</span>
                </div>
                <p className="text-sm">{event.Event_Name || ''}</p>
              </div>
              <div className="flex space-x-3 max-sm:justify-between sm:ml-auto">
                <div className="flex gap-3">
                  <Tag className="size-4 text-blue-500" />
                  <span className="text-sm font-medium">Type:</span>
                </div>
                <p className="text-sm">
                  {event.Event_Type === 'company' ? 'Non Holiday' : 'Holiday'}
                </p>
              </div>
            </div>

            <div className="grid h-fit grid-cols-1 max-sm:gap-3 sm:grid-cols-2">
              <div className="flex space-x-3 max-sm:justify-between">
                <div className="flex gap-3">
                  <Calendar className="size-4 text-blue-500" />
                  <span className="text-sm font-medium">Start Date:</span>
                </div>
                <p className="text-sm">{formatDate(event.Event_Start)}</p>
              </div>
              <div className="flex space-x-3 max-sm:justify-between sm:ml-auto">
                <div className="flex gap-3">
                  <Calendar className="size-4 text-blue-500" />
                  <span className="text-sm font-medium">End Date:</span>
                </div>
                <p className="text-sm">{formatDate(event.Event_End)}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <span className="text-sm font-medium">Description:</span>
              <div className="description-content max-h-60 overflow-y-auto rounded-md bg-muted/70 p-4 text-sm">
                {/* Render the HTML content from Quill */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: event.Event_Discription || '',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
