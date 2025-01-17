import React from 'react';

import { BookImage, Calendar, Tag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { AnnouncementType } from '@/libs/validations/hr-announcements';

import { RecentAnnouncement } from '@/types/announcement.types';

import './ViewAnnouncement.css';

interface ViewAnnouncementDialogProps {
  announcement?: AnnouncementType | RecentAnnouncement;
  onOpenChange: () => void;
  onCloseChange?: () => void;
  open: boolean;
  user?: string;
}

export function ViewAnnouncement({
  announcement,
  onOpenChange,
  open,
  user,
}: ViewAnnouncementDialogProps) {
  const variant = announcement?.isEnabled ? 'success' : 'destructive';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[550px] flex-col p-6 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Announcement Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {user === 'hr' && (
            <div className="h-fit text-right text-xl font-semibold">
              <Badge variant={variant}>
                {announcement?.isEnabled ? 'Enable' : 'Disabled'}
              </Badge>
            </div>
          )}
          <div className="grid h-fit gap-4 py-4 text-left">
            <div className="grid h-fit grid-cols-2">
              <div className="flex space-x-3">
                <BookImage className="size-4 text-blue-500" />
                <span className="text-sm font-medium">Title:</span>
                <p className="text-sm">{announcement?.title}</p>
              </div>
              <div className="flex space-x-3">
                <Tag className="size-4 text-blue-500" />
                <span className="text-sm font-medium">Priority:</span>
                <p className="text-sm">{announcement?.Priority}</p>
              </div>
            </div>

            <div className="grid h-fit grid-cols-2">
              <div className="flex space-x-3">
                <Calendar className="size-4 text-blue-500" />
                <span className="text-sm font-medium">Start Date:</span>
                <p className="text-sm">
                  {announcement?.StartDate
                    ? new Date(announcement?.StartDate).toLocaleDateString(
                        'en-US',
                        {
                          weekday: 'short',
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        },
                      )
                    : 'N/A'}
                </p>
              </div>
              <div className="flex space-x-3">
                <Calendar className="size-4 text-blue-500" />
                <span className="text-sm font-medium">End Date:</span>
                <p className="text-sm">
                  {announcement?.EndDate
                    ? new Date(announcement?.EndDate).toLocaleDateString(
                        'en-US',
                        {
                          weekday: 'short',
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        },
                      )
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <span className="text-sm font-medium">Description:</span>
              <div className="description-content max-h-60 overflow-y-auto rounded-md bg-muted/70 p-4 text-sm">
                <div
                  dangerouslySetInnerHTML={{
                    __html: announcement?.Description || '',
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
