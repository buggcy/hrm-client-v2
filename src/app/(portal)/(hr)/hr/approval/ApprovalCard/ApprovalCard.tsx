'use client';

import { useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { useMutation } from '@tanstack/react-query';
import { Mail, Phone, UserCog } from 'lucide-react';
import { z } from 'zod';

import { LoadingButton } from '@/components/LoadingButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { approvalStatus, EmployeeListType } from '@/libs/validations/employee';
import { employeeApprovalRequest } from '@/services/hr/employee.service';
import { AuthStoreType } from '@/stores/auth';
import { cn } from '@/utils';

import { RejectDialog } from './RejectDialog';

import { IPersona } from '@/types';

const approvalSchema = z
  .object({
    hrId: z.string().min(1, 'HR ID is required'),
    employeeId: z.string().min(1, 'Employee ID is required'),
    isApproved: z.enum(approvalStatus),
    rejectedReason: z.string().optional(),
  })
  .refine(
    data =>
      data.isApproved !== 'Rejected' ||
      (data.rejectedReason && data.rejectedReason.trim().length > 0),
    {
      message: 'Rejected reason is required if the status is "Rejected"',
      path: ['rejectedReason'],
    },
  );

export type ApprovalEmployeeType = z.infer<typeof approvalSchema>;

export const ApprovalCard = ({
  person,
  selected,
  isSelectable,
  handleSelect,
  refetchApprovalList,
}: {
  person: EmployeeListType;
  selected?: boolean;
  isSelectable?: boolean;
  handleSelect?: () => void;
  onClick: (id: IPersona['persona_id']) => void;
  isLoading?: boolean;
  refetchApprovalList: () => void;
}) => {
  const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const { mutate, isPending } = useMutation({
    mutationFn: employeeApprovalRequest,
    onError: err => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on employee approvel request!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      refetchApprovalList();
    },
  });

  const handleRejectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setRejectDialogOpen(false);
  };

  const handleAccept = () => {
    const approvalData = {
      isApproved: 'Approved' as const,
      hrId: user?.id || '',
      employeeId: person._id,
    };

    const validationResult = approvalSchema.safeParse(approvalData);

    if (validationResult.success) {
      mutate(approvalData);
    } else {
      const errorMessages = validationResult.error.errors.map(
        error => error.message,
      );
      toast({
        title: 'Validation Error',
        description: errorMessages.join(', '),
        variant: 'error',
      });
    }
  };

  const handleReject = (reason: string) => {
    const rejectionData = {
      isApproved: 'Rejected' as const,
      hrId: user?.id || '',
      employeeId: person._id,
      rejectedReason: reason,
    };

    const validationResult = approvalSchema.safeParse(rejectionData);

    if (validationResult.success) {
      mutate(rejectionData);
      closeRejectDialog();
    } else {
      const errorMessages = validationResult.error.errors.map(
        error => error.message,
      );
      toast({
        title: 'Validation Error',
        description: errorMessages.join(', '),
        variant: 'error',
      });
    }
  };

  return (
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
            <AvatarImage src={person?.Avatar || ''} alt="User Avatar" />
            <AvatarFallback className="uppercase">
              {person?.firstName?.charAt(0)}
              {person?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex space-x-2">
            <Badge variant="label" className="w-fit truncate text-sm">
              {new Date(person.updatedAt).toDateString()}
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
                    <p>{person.email}</p>
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
                    <p>{person.Designation}</p>
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
                    <p>{person.contactNo}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <h3 className="truncate text-lg font-semibold">
              {person.firstName} {person.lastName}
            </h3>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {person.companyEmail}
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex content-start items-start gap-6 p-0">
        <LoadingButton
          className="p-2 text-sm"
          variant="outline"
          loading={isPending}
          disabled={isPending}
          onClick={handleRejectClick}
        >
          Reject Request
        </LoadingButton>
        <LoadingButton
          className="p-2 text-sm"
          variant="primary-inverted"
          onClick={handleAccept}
          loading={isPending}
          disabled={isPending}
        >
          Accept Request
        </LoadingButton>
      </CardFooter>
      <RejectDialog
        isOpen={isRejectDialogOpen}
        onClose={closeRejectDialog}
        onReject={handleReject}
      />
    </Card>
  );
};
