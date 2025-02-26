import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { LoadingButton } from '@/components/LoadingButton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { employeeApprovalRequest } from '@/services/hr/employee.service';
import { AuthStoreType } from '@/stores/auth';

import { approvalSchema } from './ApprovalCard';
import { RejectDialog } from './RejectDialog';

export const ApprovalActions = ({
  employeeId,
  refetchApprovalList,
}: {
  employeeId: string;
  refetchApprovalList?: () => void;
}) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { mutate, isPending } = useMutation({
    mutationFn: employeeApprovalRequest,
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on employee approval request!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      refetchApprovalList?.();
      pathname === '/hr/approval'
        ? refetchApprovalList?.()
        : router.replace('/hr/approval');
    },
  });

  const handleAccept = () => {
    const approvalData = {
      isApproved: 'Approved' as const,
      hrId: user?.id || '',
      employeeId,
    };

    const validationResult = approvalSchema.safeParse(approvalData);
    if (validationResult.success) {
      mutate(approvalData);
    } else {
      toast({
        title: 'Validation Error',
        description: validationResult.error.errors
          .map(e => e.message)
          .join(', '),
        variant: 'error',
      });
    }
  };

  const handleReject = (reason: string) => {
    const rejectionData = {
      isApproved: 'Rejected' as const,
      hrId: user?.id || '',
      employeeId,
      rejectedReason: reason,
    };

    const validationResult = approvalSchema.safeParse(rejectionData);
    if (validationResult.success) {
      mutate(rejectionData);
      setRejectDialogOpen(false);
    } else {
      toast({
        title: 'Validation Error',
        description: validationResult.error.errors
          .map(e => e.message)
          .join(', '),
        variant: 'error',
      });
    }
  };

  return (
    <div className="flex gap-4">
      <LoadingButton
        className="p-2 text-sm"
        variant="outline"
        loading={isPending}
        disabled={isPending}
        onClick={() => setRejectDialogOpen(true)}
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

      <RejectDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onReject={handleReject}
      />
    </div>
  );
};
