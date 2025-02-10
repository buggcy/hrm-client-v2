import React from 'react';

import { Eye } from 'lucide-react';

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

interface ViewLeaveProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  data?: LeaveListType | null;
}
const ViewLeaveList = ({ open, onCloseChange, data }: ViewLeaveProps) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`View Leave Request`}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end">
            <Badge
              className="capitalize"
              variant={
                data?.Status === 'Approved'
                  ? 'success'
                  : data?.Status === 'Rejected'
                    ? 'destructive'
                    : data?.Status === 'Pending'
                      ? 'progress'
                      : data?.Status === 'Canceled'
                        ? 'error'
                        : 'default'
              }
            >
              {data?.Status}
            </Badge>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">Leave Title</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.Title}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">Leave Type</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.Leave_Type}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">Start Date</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.Start_Date
                  ? (() => {
                      const field = new Date(Date.parse(data?.Start_Date));
                      const day = field.toLocaleDateString('en-US', {
                        weekday: 'short',
                      });
                      const date = field.toDateString().slice(4);
                      return (
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{day}</Badge>
                          <span className="max-w-[500px] truncate">{date}</span>
                        </div>
                      );
                    })()
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">End Date</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.End_Date
                  ? (() => {
                      const field = new Date(Date.parse(data?.End_Date));
                      const day = field.toLocaleDateString('en-US', {
                        weekday: 'short',
                      });
                      const date = field.toDateString().slice(4);
                      return (
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{day}</Badge>
                          <span className="max-w-[500px] truncate">{date}</span>
                        </div>
                      );
                    })()
                  : 'N/A'}
              </p>
            </div>
          </div>
          {data?.Status === 'Rejected' && (
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
          {data?.Proof_Document && (
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
                          {typeof data?.Proof_Document === 'string' &&
                            decodeURIComponent(
                              String(data?.Proof_Document).split('/').pop() ||
                                '',
                            )}
                          <Eye
                            className="ml-2 inline cursor-pointer text-primary/80 hover:text-primary"
                            onClick={() =>
                              data?.Proof_Document &&
                              window.open(
                                String(data?.Proof_Document),
                                '_blank',
                              )
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
          )}
          <div className="flex flex-col justify-between">
            <p className="text-sm font-semibold">Leave Description</p>
            <p className="text-justify indent-16 text-gray-600 dark:text-gray-300">
              {data?.Description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewLeaveList;
