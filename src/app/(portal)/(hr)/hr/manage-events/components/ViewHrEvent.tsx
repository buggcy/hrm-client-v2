import React from 'react';

import { BookImage, Calendar, Tag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogContent } from '@/components/ui/dialog';

import { HrEventsListType } from '@/libs/validations/employee';

interface EventDetailsCardProps {
  event: HrEventsListType;
  onClose: () => void;
}

export function ViewHrEvent({ event, onClose }: EventDetailsCardProps) {
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
    <DialogContent className="flex h-full max-h-[550px] flex-col justify-between p-6 sm:max-w-[600px]">
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
        <div className="grid h-fit gap-4 py-4 text-left">
          <div className="grid h-fit grid-cols-2">
            <div className="flex space-x-3">
              <BookImage className="size-4 text-blue-500" />
              <span className="text-sm font-medium">Event Name:</span>
              <p className="text-sm">{event.Event_Name}</p>
            </div>
            <div className="flex space-x-3">
              <Tag className="size-4 text-blue-500" />
              <span className="text-sm font-medium">Type:</span>
              <p className="text-sm">
                {event.Event_Type === 'company' ? 'Non Holiday' : 'Holiday'}
              </p>
            </div>
          </div>

          <div className="grid h-fit grid-cols-2">
            <div className="flex space-x-3">
              <Calendar className="size-4 text-blue-500" />
              <span className="text-sm font-medium">Start Date:</span>
              <p className="text-sm">{formatDate(event.Event_Start)}</p>
            </div>
            <div className="flex space-x-3">
              <Calendar className="size-4 text-blue-500" />
              <span className="text-sm font-medium">End Date:</span>
              <p className="text-sm">{formatDate(event.Event_End)}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <span className="text-sm font-medium">Description:</span>
            <div className="max-h-60 overflow-y-auto px-8 text-sm">
              {' '}
              <p>{event.Event_Discription}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>Close</Button>
      </div>
    </DialogContent>
  );
}
