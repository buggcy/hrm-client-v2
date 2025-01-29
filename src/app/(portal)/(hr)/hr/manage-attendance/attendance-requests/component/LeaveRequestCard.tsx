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
import { DateRange } from 'react-day-picker';

import CopyToClipboard from '@/components/CopyToClipboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useAllowLeaveListQuery } from '@/hooks/hr/useLeaveList.hook';
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
  selectedDate,
}: {
  selectedDate?: DateRange;
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
  const { data: allowLeaveList } = useAllowLeaveListQuery(person?.User_ID?._id);

  const { mutate: AcceptMutate, isPending: AcceptPending } = useMutation({
    mutationFn: ({ id, hrId }: { id: string; hrId: string | undefined }) =>
      acceptLeaveRecord(id, hrId!),
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
      setRefetchLeaveList(true);
      setShowAcceptDialog(false);
    },
  });

  const selectedFromDate = new Date(selectedDate?.from ?? Date.now());
  const currentYear = selectedFromDate.getFullYear();
  const currentMonth = selectedFromDate.getMonth() + 1;

  const currentMonthRecord = allowLeaveList?.monthlyLeaveRecords?.find(
    record => record.year === currentYear && record.month === currentMonth,
  );

  const currentYearRecord = allowLeaveList?.annualLeavesRecords?.find(
    record => record.year === currentYear,
  );

  const startDate = person?.Start_Date ? new Date(person.Start_Date) : null;
  const endDate = person?.End_Date ? new Date(person.End_Date) : null;

  const durationInDays =
    startDate && endDate
      ? Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1
      : 'N/A';

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
              <CopyToClipboard
                text={person.User_ID.companyEmail}
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
                    <p>{person?.User_ID?.Designation}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <CopyToClipboard
                text={person.User_ID.contactNo}
                icon={<Phone size={12} />}
                type="Contact number"
              />
            </div>
          </div>
          <div className="flex justify-between">
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
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Badge>Leave Info</Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="mb-2 rounded-md border bg-white text-black dark:bg-zinc-900 dark:text-white">
                    <div className="max-h-[149px] overflow-y-auto">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Annual</TableHead>
                            <TableHead>Casual</TableHead>
                            <TableHead>Sick</TableHead>
                            <TableHead>Monthly</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Allowed Leaves</TableCell>
                            <TableCell>
                              {allowLeaveList?.annualLeavesAllowed}
                            </TableCell>
                            <TableCell>
                              {allowLeaveList?.allowedCasualLeaves}
                            </TableCell>
                            <TableCell>
                              {allowLeaveList?.allowedSickLeaves}
                            </TableCell>
                            <TableCell>
                              {allowLeaveList?.monthlyLeavesAllowed}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Taken Leaves</TableCell>
                            <TableCell>
                              {currentYearRecord
                                ? currentYearRecord.annualLeaves
                                : 0}
                            </TableCell>
                            <TableCell>
                              {currentMonthRecord
                                ? currentMonthRecord.casualLeaves
                                : 0}
                            </TableCell>
                            <TableCell>
                              {currentMonthRecord
                                ? currentMonthRecord.sickLeaves
                                : 0}
                            </TableCell>
                            <TableCell>
                              {currentMonthRecord
                                ? currentMonthRecord.sickLeaves +
                                  currentMonthRecord.casualLeaves
                                : 0}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="mt-2 flex justify-between">
            <p className="text-sm font-semibold">Leave Title</p>
            <span className="truncate text-sm font-medium text-muted-foreground">
              {person?.Title}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Leave Type</p>
            <span className="text-sm font-medium text-muted-foreground">
              {person?.Leave_Type}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Start Date</p>
            <span className="text-sm font-medium text-muted-foreground">
              {person?.Start_Date
                ? new Date(person?.Start_Date).toDateString()
                : 'N/A'}{' '}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">End Date</p>
            <span className="text-sm font-medium text-muted-foreground">
              {person?.End_Date
                ? new Date(person?.End_Date).toDateString()
                : 'N/A'}
            </span>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-sm font-semibold">Leave Duration</p>
            <span className="truncate text-sm font-medium text-muted-foreground">
              {`${durationInDays} ${durationInDays === 1 ? 'day' : 'days'}`}
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
