'use client';

import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Mail, Phone, UserCog } from 'lucide-react';

import CopyToClipboard from '@/components/CopyToClipboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { OvertimeListType } from '@/libs/validations/overtime';
import { AcceptRejectOvertime } from '@/services/employee/overtime.service';
import { AuthStoreType } from '@/stores/auth';
import { OvertimeStoreType } from '@/stores/employee/overtime';
import { cn } from '@/utils';

import AcceptOrRejectOvertime from '../model/AcceptRejectModal';

import { MessageErrorResponse } from '@/types';

export const OvertimeCard = ({ request }: { request: OvertimeListType }) => {
  const { overtimeStore } = useStores() as {
    overtimeStore: OvertimeStoreType;
  };
  const { setRefetchOvertimeList } = overtimeStore;

  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const userId: string | undefined = user?.id;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [requestCard, setRequestCard] = useState<OvertimeListType | null>(null);

  const { mutate: AcceptMutate, isPending: AcceptPending } = useMutation({
    mutationFn: AcceptRejectOvertime,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on rejecting overtime!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchOvertimeList(true);
      setIsOpen(false);
    },
  });

  const handleAccept = () => {
    const acceptBody = {
      hrId: userId ?? '',
      status: 'Approved',
      userId: requestCard?.userId?._id ?? '',
    };
    AcceptMutate({ id: requestCard?._id ?? '', body: acceptBody });
  };

  const time = request?.overtimeMinutes || 0;
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return (
    <>
      <Card
        className={cn(
          'group relative flex flex-col justify-between rounded-md p-4 outline-primary hover:shadow',
        )}
      >
        {request.createdAt &&
          request.date &&
          request.createdAt > request.date && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="absolute right-0 top-0 flex size-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-error">
                    !
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Leave request was made after the start date. Please check
                    the request details.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
                text={request?.userId?.companyEmail}
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
                text={request?.userId?.contactNo}
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
            <p className="text-sm font-semibold">Overtime Date</p>
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
            <p className="text-sm font-semibold">Overtime Minutes</p>
            <span className="text-sm font-medium text-muted-foreground">
              {request?.overtimeMinutes}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Overtime in Hours</p>
            <span className="text-sm font-medium text-muted-foreground">
              {`${hours} Hours ${minutes} Minutes`}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{'Overtime Reason'}</p>
            <span
              className="ml-3 truncate text-sm font-medium text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: request?.reason || '',
              }}
            ></span>
          </div>
        </CardContent>
        <CardFooter className="mt-4 flex content-start items-start gap-6 p-0">
          <Button
            className="p-2 text-sm"
            variant="outline"
            onClick={() => {
              setRequestCard(request);
              setModalType('reject');
              setIsOpen(true);
            }}
          >
            Reject Request
          </Button>
          <Button
            className="p-2 text-sm"
            variant="primary-inverted"
            onClick={() => {
              setRequestCard(request);
              setModalType('accept');
              setIsOpen(true);
            }}
          >
            Accept Request
          </Button>
        </CardFooter>
      </Card>
      <AcceptOrRejectOvertime
        type={modalType}
        isOpen={isOpen}
        showActionToggle={setIsOpen}
        title={
          modalType === 'accept'
            ? 'Accept Overtime Request'
            : 'Reject Overtime Request'
        }
        isPending={AcceptPending}
        description={
          modalType === 'accept'
            ? 'Are you sure you want to accept this overtime request?'
            : ''
        }
        onSubmit={handleAccept}
        request={requestCard}
        hrId={userId}
        setRefetchOvertimeList={setRefetchOvertimeList}
      />
    </>
  );
};
