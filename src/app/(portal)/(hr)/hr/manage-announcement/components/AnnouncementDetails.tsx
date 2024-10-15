import React from 'react';

import { format, isValid } from 'date-fns';
import { ArrowDown, ArrowRight, ArrowUp, CalendarIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { AnnouncementType } from '@/libs/validations/hr-announcement';

export interface AnnouncementDetailsDialogProps {
  open: boolean;
  onOpenChange: () => void;
  announcementData: AnnouncementType | null;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return isValid(date) ? format(date, 'PPP') : 'Invalid date';
};

export function AnnouncementDetailsDialog({
  open,
  onOpenChange,
  announcementData,
}: AnnouncementDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Announcement Detail</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Title</Label>
            <div className="col-span-3">{announcementData?.title || 'N/A'}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Start Date</Label>
            <div className="col-span-3 flex items-center">
              <CalendarIcon className="mr-2 size-4" />
              {formatDate(announcementData?.StartDate)}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">End Date</Label>
            <div className="col-span-3 flex items-center">
              <CalendarIcon className="mr-2 size-4" />
              {formatDate(announcementData?.EndDate)}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Priority</Label>
            <div className="col-span-3 flex items-center">
              {announcementData?.Priority === 'HIGH' && <ArrowUp />}
              {announcementData?.Priority === 'MEDIUM' && <ArrowRight />}
              {announcementData?.Priority === 'LOW' && <ArrowDown />}

              {announcementData?.Priority || 'N/A'}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
            <div className="col-span-3">
              {announcementData?.isEnabled !== undefined ? (
                announcementData?.isEnabled ? (
                  <Badge variant={'success'}>Enabled</Badge>
                ) : (
                  <Badge variant={'error'}>Disabled</Badge>
                )
              ) : (
                'N/A'
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Description</Label>
            <div className="col-span-3">
              {announcementData?.Description || 'N/A'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AnnouncementDetailsDialog;
