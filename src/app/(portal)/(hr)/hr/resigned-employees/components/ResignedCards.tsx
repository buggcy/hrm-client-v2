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
import { Mail, Phone, UserCog } from 'lucide-react';

import CopyToClipboard from '@/components/CopyToClipboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { ResignedListType } from '@/libs/validations/employee';
import { ApprovedRejectResignation } from '@/services/hr/employee.service';
import { AuthStoreType } from '@/stores/auth';
import { cn } from '@/utils';

import AcceptRejectDialog from './AcceptRejectResignedModal';

import { IPersona, MessageErrorResponse } from '@/types';

export const ResignedRequestCard = ({
  person,
  selected,
  isSelectable,
  handleSelect,
  setRefetchEmployeeList,
}: {
  person: ResignedListType;
  selected?: boolean;
  isSelectable?: boolean;
  handleSelect?: () => void;
  onClick: (id: IPersona['persona_id']) => void;
  isLoading?: boolean;
  setRefetchEmployeeList: (value: boolean) => void;
}) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const userId: string | undefined = user?.id;
  const [modal, setModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');

  const [selectedId, setSelectedId] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('');

  const { mutate, isPending } = useMutation({
    mutationFn: ApprovedRejectResignation,
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
      setRefetchEmployeeList(true);
      setModal(false);
    },
  });
  const handleAccept = () => {
    mutate({
      id: selectedId,
      employeeId: employeeId,
      body: {
        hrId: userId ?? '',
        isApproved: 'Approved',
      },
    });
  };

  const handleReject = () => {
    mutate({
      id: selectedId,
      employeeId: employeeId,
      body: {
        hrId: userId ?? '',
        isApproved: 'Rejected',
      },
    });
  };

  return (
    <>
      <Card
        className={cn(
          'group flex h-full flex-col justify-between rounded-md p-4 outline-primary hover:shadow',
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
                src={person?.employee?.Avatar || ''}
                alt="User Avatar"
              />
              <AvatarFallback className="uppercase">
                {person?.employee?.firstName?.charAt(0)}
                {person?.employee?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex space-x-2">
              <Badge variant="label" className="w-fit truncate text-sm">
                {person?.createdAt
                  ? new Date(person.createdAt).toDateString()
                  : 'N/A'}
              </Badge>
              <CopyToClipboard
                text={person?.employee?.companyEmail}
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
                    <p>{person?.employee?.Designation || '-'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <CopyToClipboard
                text={person?.employee?.contactNo}
                icon={<Phone size={12} />}
                type="Contact number"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <h3 className="truncate text-lg font-semibold">
                {person?.employee?.firstName} {person?.employee?.lastName}
              </h3>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {person?.employee?.companyEmail}
            </p>
          </div>
          {person?.type && (
            <div className="flex justify-between">
              <p className="text-sm font-semibold">{'Resignation Type'}</p>
              <span className="text-sm font-medium text-muted-foreground">
                {person?.type}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <p className="text-sm font-semibold">{'Applied Date'}</p>
            <span className="text-sm font-medium text-muted-foreground">
              {person?.appliedDate
                ? new Date(person?.appliedDate).toDateString()
                : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">{'Assigned Date'}</p>
            <span className="text-sm font-medium text-muted-foreground">
              {person?.assignedDate
                ? new Date(person.assignedDate).toDateString()
                : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">{'Reason'}</p>
            <span className="text-sm font-medium text-muted-foreground">
              {person?.reason}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{'Description'}</p>
            <span className="ml-3 truncate text-sm font-medium text-muted-foreground">
              {person?.description}
            </span>
          </div>
        </CardContent>
        <CardFooter className="mt-4 flex content-start items-start gap-6 p-0">
          <Button
            className="p-2 text-sm"
            variant="outline"
            onClick={() => {
              setModalType('reject');
              setSelectedId(person?._id);
              setEmployeeId(person?.employee ? person?.employee?._id : '');
              setModal(true);
            }}
          >
            Reject Request
          </Button>
          <Button
            className="p-2 text-sm"
            variant="primary-inverted"
            onClick={() => {
              setModalType('accept');
              setSelectedId(person?._id);
              setEmployeeId(person?.employee ? person?.employee?._id : '');
              setModal(true);
            }}
          >
            Accept Request
          </Button>
        </CardFooter>
      </Card>
      <AcceptRejectDialog
        isOpen={modal}
        showActionToggle={setModal}
        title={`Confirm ${modalType === 'accept' ? 'Accept' : 'Reject'}`}
        isPending={isPending}
        description={`Are your sure you want to ${modalType === 'accept' ? 'accept' : 'reject'} this resignation request?`}
        handleDelete={modalType === 'accept' ? handleAccept : handleReject}
        type={modalType}
      />
    </>
  );
};
