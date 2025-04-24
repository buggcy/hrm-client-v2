/* eslint-disable tailwindcss/no-custom-classname */
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import moment from 'moment';

import { LoadingButton } from '@/components/LoadingButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';

import { employeeApprovalRequest } from '@/services/hr/employee.service';

import { approvalSchema } from '../../(hr)/hr/approval/ApprovalCard/ApprovalCard';
import { RejectDialog } from '../../(hr)/hr/approval/ApprovalCard/RejectDialog';

import { MessageErrorResponse } from '@/types';
import { EmployeeById } from '@/types/employee.types';

interface ProfileDetailsProps {
  user: EmployeeById;
  hrId?: string;
  refetch: () => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  user,
  hrId,
  refetch,
}) => {
  const [isRejectDialogOpen, setRejectDialogOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const userIdFromParams = searchParams.get('userId');
  const router = useRouter();
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isAccepting, setIsAccepting] = useState<boolean>(false);

  const { mutate } = useMutation({
    mutationFn: employeeApprovalRequest,
    onError: (err: AxiosError<MessageErrorResponse>) => {
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
      refetch();
    },
  });
  const closeRejectDialog = () => {
    setRejectDialogOpen(false);
  };

  const handleRejectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRejectDialogOpen(true);
  };
  const handleAccept = () => {
    setIsAccepting(true);
    const approvalData = {
      isApproved: 'Approved' as const,
      hrId: hrId || '',
      employeeId: user?._id,
    };

    const validationResult = approvalSchema.safeParse(approvalData);

    if (validationResult.success) {
      mutate(approvalData, {
        onSettled: () => setIsAccepting(false),
      });
    } else {
      setIsAccepting(false);
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
    setIsRejecting(true);
    const rejectionData = {
      isApproved: 'Rejected' as const,
      hrId: hrId || '',
      employeeId: user?._id,
      rejectedReason: reason,
    };

    const validationResult = approvalSchema.safeParse(rejectionData);

    if (validationResult.success) {
      mutate(rejectionData, {
        onSuccess: () => {
          setTimeout(() => {
            router.push(`/hr/add-employees`);
          }, 1000);
        },
        onSettled: () => setIsRejecting(false),
      });
      closeRejectDialog();
    } else {
      setIsRejecting(false);
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
    <>
      <Card>
        <CardContent>
          <div className="my-3 flex justify-center">
            <Avatar className="size-16">
              {user?.Avatar ? (
                <AvatarImage src={user?.Avatar} alt="User Avatar" />
              ) : (
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="mb-4 text-center">
            <a
              className="text-lg font-semibold text-gray-800 hover:underline dark:text-white"
              href="#"
            >
              {user?.firstName || '-'} {user?.lastName || '-'}
            </a>
            <div className="mt-2 text-center text-gray-600 dark:text-gray-300">
              {user?.Designation || ''}
            </div>
          </div>
          {userIdFromParams && user?.isApproved === 'Pending' && (
            <>
              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <LoadingButton
                  className="flex-1 p-2 text-sm"
                  variant="outline"
                  loading={isRejecting}
                  disabled={isRejecting}
                  onClick={handleRejectClick}
                >
                  Reject Request
                </LoadingButton>
                <LoadingButton
                  className="flex-1 p-2 text-sm"
                  variant="primary-inverted"
                  loading={isAccepting}
                  disabled={isAccepting}
                  onClick={handleAccept}
                >
                  Accept Request
                </LoadingButton>
              </div>
            </>
          )}
          {!userIdFromParams && (
            <Link href="/profile-setting">
              <Button
                variant="ghost"
                className="w-full border border-gray-300 bg-transparent text-black dark:text-white"
              >
                Edit Profile
              </Button>
            </Link>
          )}

          <div className="my-4 border-b border-gray-300" />

          <div className="mb-2 mt-4 text-sm font-bold dark:text-white">
            Summary
          </div>
          <p className="dark:text-gray-300">
            {user?.profileDescription || 'No Summary available'}
          </p>

          <div className="my-4 border-b border-gray-300" />
          <div className="flex justify-between">
            <div className="mt-1 text-sm font-bold dark:text-white">
              Current Status
            </div>
            <div className="text-left">
              <Badge>{user?.Current_Status || 'unknown'}</Badge>
            </div>
          </div>
          <div className="my-4 border-b border-gray-300" />

          <div className="mb-2 mt-4 text-sm font-bold dark:text-white">
            Contact
          </div>
          <dl className="grid grid-cols-1 gap-y-2">
            <div className="flex justify-between">
              <dt className="font-medium">Phone</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.contactNo || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Email</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.email || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Gender</dt>
              <dd className="capitalize leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Gender || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">DOB</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.DOB
                  ? moment(user.DOB as string | number | Date).format(
                      'YYYY-MM-DD',
                    )
                  : '-'}
              </dd>
            </div>
          </dl>
          <div className="my-4 border-b border-gray-300" />

          <div className="mb-2 mt-4 text-sm font-bold dark:text-white">
            Address
          </div>
          <dl className="grid grid-cols-1 gap-y-2">
            <div className="flex justify-between">
              <dt className="font-medium">Country</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Address?.country || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Province</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Address?.province || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">City</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Address?.city || '-'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium">Street</dt>
              <dd className="text-right leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Address?.street || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Land Mark</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Address?.landMark || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Postal Code</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Address?.zip || '-'}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-nowrap font-medium">Full Address</dt>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <dd className="truncate text-right leading-relaxed text-gray-600 dark:text-gray-300">
                      {user?.Address?.full || '-'}
                    </dd>
                  </TooltipTrigger>
                  <TooltipContent>
                    {user?.Address?.full || 'No address available'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </dl>
        </CardContent>
      </Card>
      <RejectDialog
        isOpen={isRejectDialogOpen}
        onClose={closeRejectDialog}
        onReject={handleReject}
      />
    </>
  );
};

export default ProfileDetails;
