'use client';

import React from 'react';

import { Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { LeaveHistoryListType } from '@/libs/validations/leave-history';

interface DialogDemoProps {
  data: LeaveHistoryListType;
  open: boolean;
  onOpenChange: () => void;
  onCloseChange?: () => void;
}

export function ViewLeaveHistoryDialog({
  data,
  open,
  onOpenChange,
}: DialogDemoProps) {
  const startDate = new Date(data.Start_Date);
  const endDate = new Date(data.End_Date);
  const timeDiff = endDate.getTime() - startDate.getTime();

  const days = timeDiff / (1000 * 60 * 60 * 24);
  const status = data.Status;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-fit p-8">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 text-nowrap pt-4">
          <span className="font-bold">Leave Title</span>
          <span className="text-right">{data.Title}</span>

          <span className="font-bold">Leave Type</span>
          <span className="text-right">{data.Leave_Type}</span>

          <span className="font-bold">Leave Duration</span>
          <span className="text-right">
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </span>
          <span className="font-bold">Days</span>
          <span className="text-right">{days + 1}</span>
          <span className="font-bold">Leave Status</span>
          <span className="text-right">
            <Badge
              className="ml-2 px-2 py-1"
              variant={
                status === 'Approved'
                  ? 'success'
                  : status === 'Rejected' || status === 'Canceled'
                    ? 'error'
                    : 'warning'
              }
            >
              {status}
            </Badge>
          </span>
          <span className="font-bold">Proof Document</span>
          <span className="flex justify-end">
            <a
              href={data.Proof_Document}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/80 hover:text-primary"
            >
              <Eye className="size-4" />
            </a>
          </span>
          <span className="col-span-2 font-bold">Description</span>
          <span className="col-span-2">{data.Description}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
