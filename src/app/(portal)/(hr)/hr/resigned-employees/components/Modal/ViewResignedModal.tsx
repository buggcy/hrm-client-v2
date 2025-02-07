import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ResignedListType } from '@/libs/validations/employee';

interface ViewProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  data?: ResignedListType | null;
}
const ViewResignedModal = ({ open, onCloseChange, data }: ViewProps) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`View Resignation Request`}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end">
            <Badge
              className="capitalize"
              variant={
                data?.isApproved === 'Approved'
                  ? 'success'
                  : data?.isApproved === 'Rejected'
                    ? 'destructive'
                    : data?.isApproved === 'Pending'
                      ? 'progress'
                      : 'default'
              }
            >
              {data?.isApproved}
            </Badge>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">Title</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.title}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">Reason</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.reason}
              </p>
            </div>
          </div>
          {data?.type && (
            <div className="flex flex-row justify-between">
              <div className="w-5/12">
                <p className="text-sm font-semibold">Type</p>
              </div>
              <div className="w-7/12">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {data?.type.charAt(0).toUpperCase() + data?.type.slice(1)}
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">Applied Date</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.appliedDate
                  ? (() => {
                      const field = new Date(Date.parse(data?.appliedDate));
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
              <p className="text-sm font-semibold">
                {data?.type ? 'Immediate Date' : 'Asisgned Date'}
              </p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.type ? (
                  <>
                    {data?.immedaiteDate
                      ? (() => {
                          const field = new Date(
                            Date.parse(data?.immedaiteDate),
                          );
                          const day = field.toLocaleDateString('en-US', {
                            weekday: 'short',
                          });
                          const date = field.toDateString().slice(4);
                          return (
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{day}</Badge>
                              <span className="max-w-[500px] truncate">
                                {date}
                              </span>
                            </div>
                          );
                        })()
                      : 'N/A'}
                  </>
                ) : (
                  <>
                    {data?.assignedDate
                      ? (() => {
                          const field = new Date(
                            Date.parse(data?.assignedDate),
                          );
                          const day = field.toLocaleDateString('en-US', {
                            weekday: 'short',
                          });
                          const date = field.toDateString().slice(4);
                          return (
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{day}</Badge>
                              <span className="max-w-[500px] truncate">
                                {date}
                              </span>
                            </div>
                          );
                        })()
                      : 'N/A'}
                  </>
                )}
              </p>
            </div>
          </div>
          {data?.hr && (
            <div className="flex flex-row justify-between">
              <div className="w-5/12">
                <p className="text-sm font-semibold">
                  {data?.isApproved === 'Approved'
                    ? 'Approved By'
                    : 'Rejected By'}
                </p>
              </div>
              <div className="w-7/12">
                <div className="flex items-center space-x-2">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={data?.hr?.Avatar || ''}
                      alt={`${data?.hr?.firstName} ${data?.hr?.lastName}`}
                    />
                    <AvatarFallback className="uppercase">
                      {`${data?.hr?.firstName?.charAt(0) || ''}${data?.hr?.lastName?.charAt(0) || ''}`}
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {`${data?.hr?.firstName} ${data?.hr?.lastName}`}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col justify-between">
            <p className="text-sm font-semibold">Description</p>
            <p className="text-justify indent-16 text-gray-600 dark:text-gray-300">
              {data?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewResignedModal;
