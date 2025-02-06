'use client';

import { CalendarDays } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { AttendanceRequest } from '@/libs/validations/attendance-request';
import { cn } from '@/utils';

interface RecentAttendanceRequestsProps {
  data?: AttendanceRequest[];
}

export function RecentAttendanceRequests({
  data,
}: RecentAttendanceRequestsProps) {
  console.log(data);
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Requests</CardTitle>
        <CardDescription>Showing Recent Attendance Requests</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[220px] pb-4 pt-0">
        <ScrollArea className="flex h-[204px] w-full flex-col rounded-md">
          {data?.map(request => (
            <div
              className="mb-2 h-fit w-full rounded-md border p-2 shadow-sm"
              key={request?._id}
            >
              <div className="flex size-full flex-row items-center gap-2">
                <CalendarDays
                  className={cn({
                    'size-8 text-[hsl(var(--chart-1))]':
                      request?.Status === 'Approved',
                    'size-8 text-[hsl(var(--chart-4))]':
                      request?.Status === 'Pending',
                    'size-8 text-[hsl(var(--chart-3))]':
                      request?.Status === 'Rejected',
                  })}
                />
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex flex-col">
                    <p className="p-0">
                      {new Date(request?.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="p-0">
                            {request?.reason?.length &&
                            request?.reason?.length > 28
                              ? `${request?.reason?.slice(0, 28)}...`
                              : request?.reason}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{request?.reason}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p
                    className={cn({
                      'rounded-md border bg-muted p-1 text-sm text-[hsl(var(--chart-1))]':
                        request?.Status === 'Approved',
                      'rounded-md border bg-muted p-1 text-sm text-[hsl(var(--chart-4))]':
                        request?.Status === 'Pending',
                      'rounded-md border bg-muted p-1 text-sm text-[hsl(var(--chart-3))]':
                        request?.Status === 'Rejected',
                    })}
                  >
                    {request?.Status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
