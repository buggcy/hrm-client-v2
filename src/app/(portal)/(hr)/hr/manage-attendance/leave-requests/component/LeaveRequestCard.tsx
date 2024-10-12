'use client';

import { useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Eye, Mail, Phone, UserCog } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { LeaveListType } from '@/libs/validations/hr-leave-list';
import { acceptLeaveRecord } from '@/services/hr/leave-list.service';
import { AuthStoreType } from '@/stores/auth';
import { LeaveListStoreType } from '@/stores/hr/leave-list';
import { cn } from '@/utils';

import AcceptRejectLeaveDialog from '../../leave-list/components/Modal/AcceptRejectLeaveModal';

import { IPersona, MessageErrorResponse } from '@/types';

export const LeaveRequestCard = ({
  person,
  selected,
  isSelectable,
  handleSelect,
}: {
  person: LeaveListType;
  selected?: boolean;
  isSelectable?: boolean;
  handleSelect?: () => void;
  onClick: (id: IPersona['persona_id']) => void;
  isLoading?: boolean;
}) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const userId: string | undefined = user?.id;
  const [type, setType] = useState<string>('');
  const [selectedLeaveId, setSelectedLeaveId] = useState<string>('');
  const [showAcceptDialog, setShowAcceptDialog] = useState<boolean>(false);
  const { leaveListStore } = useStores() as {
    leaveListStore: LeaveListStoreType;
  };
  const { setRefetchLeaveList } = leaveListStore;
  const { mutate: AcceptMutate, isPending: AcceptPending } = useMutation({
    mutationFn: ({ id, hrId }: { id: string; hrId: string | undefined }) =>
      acceptLeaveRecord(id, hrId!),
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on approval request!',
        variant: 'destructive',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
      });
      setRefetchLeaveList(true);
      setShowAcceptDialog(false);
    },
  });

  const handleAccept = () => {
    const hrId = userId;
    AcceptMutate({ id: selectedLeaveId, hrId });
  };

  return (
    <>
      <Card
        className={cn(
          'group flex flex-col justify-between rounded-md p-4 outline-primary hover:shadow',
          {
            'ring ring-primary': selected,
            'cursor-pointer': isSelectable,
          },
        )}
        onClick={handleSelect}
      >
        <CardContent className="flex flex-col gap-2 p-0">
          <div className="flex items-center justify-between">
            <Avatar className="size-12">
              <AvatarImage
                src={person?.User_ID?.Avatar || ''}
                alt="User Avatar"
              />
              <AvatarFallback className="uppercase">
                {person?.User_ID?.firstName?.charAt(0)}
                {person?.User_ID?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex space-x-2">
              <Badge variant="label" className="w-fit truncate text-sm">
                {person?.createdAt
                  ? new Date(person?.createdAt).toDateString()
                  : 'N/A'}
              </Badge>
              <TooltipProvider>
                <div className="flex space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-[24px] rounded-full"
                      >
                        <Mail className="size-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="mb-2 rounded-md border bg-white p-2 text-black">
                      <p>{person?.User_ID?.companyEmail}</p>
                    </TooltipContent>
                  </Tooltip>

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
                      <p>{person?.User_ID?.Designation}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-[24px] rounded-full"
                      >
                        <Phone className="size-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="mb-2 rounded-md border bg-white p-2 text-black">
                      <p>{person?.User_ID?.contactNo}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <h3 className="truncate text-lg font-semibold">
                {person?.User_ID?.firstName} {person?.User_ID?.lastName}
              </h3>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {person?.User_ID?.companyEmail}
            </p>
          </div>
          <div className="mt-2 flex justify-between">
            <p className="text-sm font-semibold">{'Leave Title'}</p>
            <span className="truncate text-sm font-medium text-muted-foreground">
              {person?.Title}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">{'Leave Type'}</p>
            <span className="text-sm font-medium text-muted-foreground">
              {person?.Leave_Type}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">{'Start Date'}</p>
            <span className="text-sm font-medium text-muted-foreground">
              {person?.Start_Date
                ? new Date(person?.Start_Date).toDateString()
                : 'N/A'}{' '}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">{'End Date'}</p>
            <span className="text-sm font-medium text-muted-foreground">
              {person?.End_Date
                ? new Date(person?.End_Date).toDateString()
                : 'N/A'}
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
                          person?.Proof_Document &&
                          window.open(String(person?.Proof_Document), '_blank')
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
            <p className="text-sm font-semibold">{'Leave Description'}</p>
            <span className="ml-3 truncate text-sm font-medium text-muted-foreground">
              {person?.Description}
            </span>
          </div>
        </CardContent>
        <CardFooter className="mt-4 flex content-start items-start gap-6 p-0">
          <Button
            className="p-2 text-sm"
            variant="outline"
            onClick={() => {
              setSelectedLeaveId(person?._id);
              setType('reject');
              setShowAcceptDialog(true);
            }}
          >
            Reject Request
          </Button>
          <Button
            className="p-2 text-sm"
            variant="primary-inverted"
            onClick={() => {
              setType('accept');
              setSelectedLeaveId(person?._id);
              setShowAcceptDialog(true);
            }}
          >
            Accept Request
          </Button>
        </CardFooter>
      </Card>
      <AcceptRejectLeaveDialog
        type={type}
        isOpen={showAcceptDialog}
        showActionToggle={setShowAcceptDialog}
        title={
          type === 'accept' ? 'Accept Leave Request' : 'Reject Leave Request'
        }
        isPending={AcceptPending}
        description={
          type === 'accept'
            ? 'Are you sure you want to accept this leave request?'
            : ''
        }
        onSubmit={handleAccept}
        id={selectedLeaveId}
        hrId={userId}
        setRefetchLeaveList={setRefetchLeaveList}
      />
    </>
  );
};
