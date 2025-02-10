'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Eye, Mail, Phone, UserCog } from 'lucide-react';

import CopyToClipboard from '@/components/CopyToClipboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { AttendanceRequestType } from '@/libs/validations/attendance-list';
import {
  acceptAttendanceRequest,
  rejectAttendanceRequest,
} from '@/services/hr/attendance-list.service';
import { AttendanceListStoreType } from '@/stores/hr/attendance-list';
import { cn } from '@/utils';

import { MessageErrorResponse } from '@/types';

export const AttendanceRequestCard = ({
  request,
}: {
  request: AttendanceRequestType;
}) => {
  const { attendanceListStore } = useStores() as {
    attendanceListStore: AttendanceListStoreType;
  };
  const { setRefetchAttendanceList } = attendanceListStore;

  const { mutate: AcceptMutate, isPending: AcceptPending } = useMutation({
    mutationFn: ({ id }: { id: string }) => acceptAttendanceRequest(id),
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on approval request!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchAttendanceList(true);
    },
  });

  const { mutate: RejectMutate, isPending: RejectPending } = useMutation({
    mutationFn: ({ id }: { id: string }) => rejectAttendanceRequest(id),
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on approval request!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchAttendanceList(true);
    },
  });

  const handleAccept = (requestId: string) => {
    AcceptMutate({ id: requestId });
  };

  const handleReject = (requestId: string) => {
    RejectMutate({ id: requestId });
  };

  const formatTime12Hour = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const formatMinutesToHours = (minutesStr: string | undefined | null) => {
    if (!minutesStr || isNaN(Number(minutesStr)) || Number(minutesStr) < 0)
      return 'N/A';

    const minutes = Number(minutesStr);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return hours > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${remainingMinutes}m`;
  };

  return (
    <>
      <Card
        className={cn(
          'group flex flex-col justify-between rounded-md p-4 outline-primary hover:shadow',
        )}
      >
        <CardContent className="flex flex-col gap-2 p-0">
          <div className="flex items-center justify-between">
            <Avatar className="size-12">
              <AvatarImage
                src={request?.userId?.Avatar || ''}
                alt="User Avatar"
              />
              <AvatarFallback className="uppercase">
                {request?.userId?.firstName?.charAt(0)}
                {request?.userId?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex space-x-2">
              <Badge variant="label" className="w-fit truncate text-sm">
                {request?.createdAt
                  ? new Date(request?.createdAt).toDateString()
                  : 'N/A'}
              </Badge>
              <CopyToClipboard
                text={request.userId.companyEmail}
                icon={<Mail size={12} />}
                type="Email address"
              />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-[24px] rounded-full"
                    >
                      <UserCog className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="mb-2 rounded-md border bg-white p-2 text-black">
                    <p>{request?.userId?.Designation}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <CopyToClipboard
                text={request.userId.contactNo}
                icon={<Phone size={12} />}
                type="Contact number"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="flex justify-between">
                <h3 className="truncate text-lg font-semibold">
                  {request?.userId?.firstName} {request?.userId?.lastName}
                </h3>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {request?.userId?.companyEmail}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Date</p>
            <span className="text-sm font-medium text-muted-foreground">
              {request?.date
                ? (() => {
                    const field = new Date(Date.parse(request?.date));
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
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Start Time</p>
            <span className="text-sm font-medium text-muted-foreground">
              {request?.Start_Date
                ? formatTime12Hour(request?.Start_Date)
                : 'N/A'}{' '}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">End Time</p>
            <span className="text-sm font-medium text-muted-foreground">
              {request?.End_Date ? formatTime12Hour(request?.End_Date) : 'N/A'}
            </span>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-sm font-semibold">Total Time</p>
            <span className="truncate text-sm font-medium text-muted-foreground">
              {formatMinutesToHours(request?.Total_Time)}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">{'Proof Document'}</p>
            <span className="truncate text-sm font-medium text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Eye
                        className="ml-2 inline cursor-pointer text-primary/80 hover:text-primary"
                        onClick={() =>
                          request?.Document &&
                          window.open(String(request?.Document), '_blank')
                        }
                        size={18}
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="mb-2 rounded-md border bg-white p-2 text-black">
                    Click to Preview Document
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{'Reason'}</p>
            <span className="ml-3 truncate text-sm font-medium text-muted-foreground">
              {request?.reason}
            </span>
          </div>
        </CardContent>
        <CardFooter className="mt-4 flex content-start items-start gap-6 p-0">
          <Button
            className="p-2 text-sm"
            variant="outline"
            onClick={() => {
              handleReject(request?._id);
            }}
            disabled={RejectPending}
          >
            Reject Request
          </Button>
          <Button
            className="p-2 text-sm"
            variant="primary-inverted"
            onClick={() => {
              handleAccept(request?._id);
            }}
            disabled={AcceptPending}
          >
            Accept Request
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
