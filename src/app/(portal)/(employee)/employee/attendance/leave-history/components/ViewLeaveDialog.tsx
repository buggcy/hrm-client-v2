'use client';

import React from 'react';

import { Eye } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { LeaveListType } from '@/libs/validations/hr-leave-list';

interface DialogDemoProps {
  data: LeaveListType;
  open: boolean;
  onOpenChange: () => void;
  onCloseChange?: () => void;
}

export function ViewLeaveHistoryDialog({
  data,
  open,
  onOpenChange,
}: DialogDemoProps) {
  const startDate = data.Start_Date && new Date(data.Start_Date);
  const endDate = data.End_Date && new Date(data.End_Date);
  const timeDiff =
    startDate instanceof Date && endDate instanceof Date
      ? endDate.getTime() - startDate.getTime()
      : 0;

  const days = timeDiff / (1000 * 60 * 60 * 24);
  const status = data.Status;
  const firstName = data?.ApprovedBy_ID?.firstName;
  const lastName = data?.ApprovedBy_ID?.lastName;
  const avatar = data?.ApprovedBy_ID?.Avatar;
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Leave</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end">
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
        </div>
        <div className="flex flex-row justify-between">
          <div className="w-5/12">
            <p className="text-sm font-semibold">Leave Title</p>
          </div>
          <div className="w-7/12">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {data.Title}
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="w-5/12">
            <p className="text-sm font-semibold">Leave Type</p>
          </div>
          <div className="w-7/12">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {data.Leave_Type}
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="w-5/12">
            <p className="text-sm font-semibold">Leave Duration</p>
          </div>
          <div className="w-7/12">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {startDate
                ? new Date(startDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })
                : 'N/A'}{' '}
              -{' '}
              {endDate
                ? new Date(endDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="w-5/12">
            <p className="text-sm font-semibold">Days</p>
          </div>
          <div className="w-7/12">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {days + 1}
            </p>
          </div>
        </div>
        {data?.ApprovedBy_ID && (
          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">Approved By</p>
            </div>
            <div className="w-7/12">
              <div className="flex items-center space-x-2">
                <Avatar className="size-6">
                  <AvatarImage
                    src={avatar || ''}
                    alt={`${firstName} ${lastName}`}
                  />
                  <AvatarFallback className="uppercase">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <span className="max-w-[500px] truncate text-sm font-medium capitalize text-gray-600 dark:text-gray-300">
                  {`${firstName} ${lastName}`}
                </span>
              </div>
            </div>
          </div>
        )}
        {data?.rejectedReason && (
          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">Rejection Reason</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.rejectedReason}
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-row justify-between">
          <div className="w-5/12">
            <p className="text-sm font-semibold">Proof Document</p>
          </div>
          <div className="w-7/12">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Eye
                        className="ml-2 inline cursor-pointer text-primary/80 hover:text-primary"
                        onClick={() =>
                          data.Proof_Document &&
                          window.open(String(data.Proof_Document), '_blank')
                        }
                        size={18}
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Click to Preview Document</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-semibold">Description</p>
          <p className="indent-16 text-sm text-gray-600 dark:text-gray-300">
            {data.Description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
