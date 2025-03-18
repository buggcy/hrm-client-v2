'use client';

import { useEffect, useState } from 'react';

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

import distributeLeaves from './LeaveDistributionCalculator';
import AcceptLeaveDialog from '../../leave-list/components/Modal/AcceptLeaveModal';
import RejectLeaveDialog from '../../leave-list/components/Modal/RejectLeaveModal';

import { IPersona, MessageErrorResponse } from '@/types';

import './LeaveRequestCard.css';

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
  const [leaveDistribution, setLeaveDistribution] = useState<
    { date: Date; isPaid: boolean; isAnnual: boolean }[]
  >([]);
  useEffect(() => {
    if (person) {
      const startDate = new Date(person.Start_Date || '');
      const endDate = new Date(person.End_Date || '');
      const joiningDate = new Date(person.User_ID.Joining_Date || '');
      const leaveData = person?.leaveData;
      const leaveType = person.Leave_Type as 'Casual' | 'Sick' | 'Annual';
      const distribution = distributeLeaves(
        leaveType,
        startDate,
        endDate,
        joiningDate,
        leaveData,
        person?.allowAnnual,
      );
      setLeaveDistribution(distribution);
    }
  }, [person]);
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const userId: string | undefined = user?.id;
  const [selectedLeaveId, setSelectedLeaveId] = useState<string>('');
  const [showAcceptDialog, setShowAcceptDialog] = useState<boolean>(false);
  const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);
  const { leaveListStore } = useStores() as {
    leaveListStore: LeaveListStoreType;
  };
  const { setRefetchLeaveList } = leaveListStore;
  const { data: allowLeaveList, refetch } = useAllowLeaveListQuery(
    person?.User_ID?._id,
  );

  const { mutate: AcceptMutate, isPending: AcceptPending } = useMutation({
    mutationFn: ({
      id,
      hrId,
      leaveDistribution,
    }: {
      id: string;
      hrId: string | undefined;
      leaveDistribution: { date: Date; isPaid: boolean; isAnnual: boolean }[];
    }) => acceptLeaveRecord(id, hrId!, leaveDistribution),
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on approval request!',
        variant: 'error',
      });
    },
    onSuccess: async response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchLeaveList(true);
      await refetch();
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
    AcceptMutate({ id: selectedLeaveId, hrId, leaveDistribution });
  };

  const onChange = (index: number, isPaid: boolean, isAnnual: boolean) => {
    const newLeaveDistribution = [...leaveDistribution];
    newLeaveDistribution[index].isPaid = isPaid;
    newLeaveDistribution[index].isAnnual = isAnnual;
    setLeaveDistribution(newLeaveDistribution);
  };

  const handleAcceptDialogOpen = () => {
    setShowAcceptDialog(true);
  };

  const handleAcceptDialogClose = () => {
    setShowAcceptDialog(false);
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
                ? (() => {
                    const field = new Date(Date.parse(person?.Start_Date));
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
            <p className="text-sm font-semibold">End Date</p>
            <span className="text-sm font-medium text-muted-foreground">
              {person?.End_Date
                ? (() => {
                    const field = new Date(Date.parse(person?.End_Date));
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
          <div className="flex flex-row justify-between">
            <p className="text-sm font-semibold">Leave Duration</p>
            <span className="truncate text-sm font-medium text-muted-foreground">
              {`${durationInDays} ${durationInDays === 1 ? 'day' : 'days'}`}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">{'Proof Document'}</p>
            <span className="truncate text-sm font-medium text-muted-foreground">
              {person?.Proof_Document ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Eye
                          className="ml-2 inline cursor-pointer text-primary/80 hover:text-primary"
                          onClick={() =>
                            person?.Proof_Document &&
                            window.open(
                              String(person?.Proof_Document),
                              '_blank',
                            )
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
              ) : (
                'N/A'
              )}
            </span>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="text-sm font-medium">Leave Description:</span>
            <div className="description-content max-h-60 overflow-y-auto rounded-md bg-muted/70 p-4 text-sm">
              <div
                dangerouslySetInnerHTML={{
                  __html: person?.Description || '',
                }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-4 flex content-start items-start justify-end gap-6 p-0">
          <Button
            className="p-2 text-sm"
            variant="outline"
            onClick={() => {
              setSelectedLeaveId(person?._id);
              setShowRejectDialog(true);
            }}
          >
            Reject Request
          </Button>
          <Button
            className="p-2 text-sm"
            variant="primary-inverted"
            onClick={() => {
              setSelectedLeaveId(person?._id);
              handleAcceptDialogOpen();
            }}
          >
            Accept Request
          </Button>
        </CardFooter>
      </Card>
      <RejectLeaveDialog
        isOpen={showRejectDialog}
        showActionToggle={setShowRejectDialog}
        id={selectedLeaveId}
        hrId={userId}
        setRefetchLeaveList={setRefetchLeaveList}
      />
      <AcceptLeaveDialog
        isOpen={showAcceptDialog}
        onOpenChange={handleAcceptDialogClose}
        onSubmit={handleAccept}
        isPending={AcceptPending}
        leaveDistribution={leaveDistribution}
        onChange={onChange}
        isAnnualLeave={person?.Leave_Type === 'Annual'}
        allowAnnual={person?.allowAnnual}
      />
    </>
  );
};
