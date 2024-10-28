import React from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { LogListType } from '@/libs/validations/hr-log';
import { formatedTime } from '@/utils/date.utils';

interface ViewLogProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  data?: LogListType | null;
}
const ViewLogDetails = ({ open, onCloseChange, data }: ViewLogProps) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`View Log`}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end">
            <Badge
              className="capitalize"
              variant={
                data?.overallStatus === 'Success'
                  ? 'success'
                  : data?.overallStatus === 'Error'
                    ? 'destructive'
                    : 'default'
              }
            >
              {data?.overallStatus}
            </Badge>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">Log Type</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.type}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">Log Title</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.title}
              </p>
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <div className="w-5/12">
              <p className="text-sm font-semibold">Log Date</p>
            </div>
            <div className="w-7/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data?.createdAt
                  ? new Date(data.createdAt).toDateString()
                  : 'N/A'}{' '}
              </p>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Log Messages</p>
            <div className="overflow-x-auto">
              <Table className="mb-2">
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message</TableHead>
                    {data?.overallStatus === 'Error' && (
                      <TableHead>Error Message</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.message && data?.message?.length > 0 ? (
                    data?.message?.map((message, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-xs">
                          {message?.timestamp
                            ? formatedTime(message?.timestamp)
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge
                            className="capitalize"
                            variant={
                              message?.status === 'Success'
                                ? 'success'
                                : message?.status === 'Error'
                                  ? 'destructive'
                                  : 'default'
                            }
                          >
                            {message?.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {message?.message || '-'}
                        </TableCell>
                        {data?.overallStatus === 'Error' && (
                          <TableCell className="text-xs">
                            {message?.errorMessage || '-'}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-gray-500 dark:text-gray-300"
                      >
                        No Message Available!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell
                      colSpan={data?.overallStatus === 'Error' ? 4 : 3}
                    >
                      Total Records
                    </TableCell>
                    <TableCell className="text-right">
                      {data?.message?.length}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewLogDetails;
