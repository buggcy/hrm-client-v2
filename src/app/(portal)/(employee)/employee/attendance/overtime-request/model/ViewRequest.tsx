import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { OvertimeListType } from '@/libs/validations/overtime';

interface ViewProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  data?: OvertimeListType | null;
}
const ViewOvertime = ({ open, onCloseChange, data }: ViewProps) => {
  const firstName = data?.hrId?.firstName;
  const lastName = data?.hrId?.lastName;
  const avatar = data?.hrId?.Avatar;
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`View Request`}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end">
            <Badge
              className="capitalize"
              variant={
                data?.status === 'Approved'
                  ? 'success'
                  : data?.status === 'Pending'
                    ? 'progress'
                    : data?.status === 'Canceled'
                      ? 'error'
                      : data?.status === 'Rejected'
                        ? 'destructive'
                        : 'default'
              }
            >
              {data?.status}
            </Badge>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">Overtime Date</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.date
                  ? (() => {
                      const field = new Date(Date.parse(data?.date));
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
              <p className="text-sm font-semibold">Overtime Minutes</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.overtimeMinutes}
              </p>
            </div>
          </div>

          {data?.hrId &&
            (data?.status === 'Approved' || data?.status === 'Rejected') && (
              <div className="flex flex-row justify-between">
                <div className="w-5/12">
                  <p className="text-sm font-semibold">
                    {data?.status === 'Approved'
                      ? 'Approved By'
                      : 'Rejected By'}
                  </p>
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
          {data?.rejectionReason && data?.status === 'Rejected' && (
            <div className="flex flex-row justify-between">
              <div className="w-5/12">
                <p className="text-sm font-semibold">Rejection Reason</p>
              </div>
              <div className="w-7/12">
                <p
                  className="text-sm text-gray-600 dark:text-gray-300"
                  dangerouslySetInnerHTML={{
                    __html: data?.rejectionReason || '',
                  }}
                ></p>
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Overtime Reason</p>
            <p
              className="indent-16 text-sm text-gray-600 dark:text-gray-300"
              dangerouslySetInnerHTML={{
                __html: data?.reason || '',
              }}
            ></p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewOvertime;
