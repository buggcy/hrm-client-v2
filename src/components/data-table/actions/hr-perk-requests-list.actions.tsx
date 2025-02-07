'use client';

import * as React from 'react';
import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Eye, MoreHorizontal, Pencil, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { HrPerkRequestListType } from '@/libs/validations/hr-perks';
import {
  approvePerkRequest,
  rejectPerkRequest,
} from '@/services/hr/perks-list.service';
import { PerkListStoreType } from '@/stores/hr/perk-list';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<HrPerkRequestListType>;
}

export function PerkRequestListRowActions({ row }: DataTableRowActionsProps) {
  const rowData = row?.original;
  const { perkListStore } = useStores() as { perkListStore: PerkListStoreType };
  const { setRefetchPerkList } = perkListStore;
  const { mutate: approvePerk } = useMutation({
    mutationFn: approvePerkRequest,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on approving perk!',
        variant: 'error',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Perk request approved successfully!',
        variant: 'success',
      });
      setRefetchPerkList(true);
    },
  });

  const { mutate: rejectPerk } = useMutation({
    mutationFn: rejectPerkRequest,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on rejecting perk!',
        variant: 'error',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Perk request rejected successfully!',
        variant: 'success',
      });
      setRefetchPerkList(true);
    },
  });

  const handleApprove = (id: string, userId: string, perkId: string) => {
    approvePerk({ id: id, employeeId: userId, perkId: perkId });
  };

  const handleReject = (id: string, userId: string, perkId: string) => {
    rejectPerk({ id: id, employeeId: userId, perkId: perkId });
  };
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {row?.getValue('hrApproval') === 'pending' ? (
            <>
              {' '}
              <DropdownMenuItem>
                <Link
                  href={rowData?.Proof_Document?.toString() || '#'}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="flex flex-row"
                >
                  <Eye className="mr-2 size-4" />
                  View Document
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleApprove(
                    rowData?.requestId?.toString() || '',
                    rowData?.userId?._id?.toString() || '',
                    rowData?.id?.toString() || '',
                  )
                }
              >
                <Pencil className="mr-2 size-4" />
                Approve Request
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() =>
                  handleReject(
                    rowData?.requestId?.toString() || '',
                    rowData?.userId?._id?.toString() || '',
                    rowData?.id?.toString() || '',
                  )
                }
              >
                <XCircle className="mr-2 size-4" />
                Reject Request
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem>
                <Link
                  href={rowData?.Proof_Document?.toString() || '#'}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="flex flex-row items-center"
                >
                  <Eye className="mr-2 size-4" />
                  View Document
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
