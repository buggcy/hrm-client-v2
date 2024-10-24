'use client';

import { useMutation } from '@tanstack/react-query';
import type { Table } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { FileDown, X } from 'lucide-react';

import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

import DataTableType from '@/libs/validations/data-table-type';
import { exportLeaveHistoryCSVData } from '@/services/employee/leave-history.service';
import { downloadFile } from '@/utils/downloadFile.utils';

import { MessageErrorResponseWithError } from '@/types';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchTerm: string;
  onSearch: (term: string) => void;
  searchLoading: boolean;
}

export function LeaveHistoryListToolbar<TData extends DataTableType>({
  table,
  searchTerm,
  onSearch,
  searchLoading,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRowIds: string[] = table
    .getSelectedRowModel()
    .rows.map(row => row.original._id);

  const { mutate, isPending } = useMutation({
    mutationFn: exportLeaveHistoryCSVData,
    onError: (err: AxiosError<MessageErrorResponseWithError>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.error || 'Error on exporting employees!',
        variant: 'error',
      });
    },
    onSuccess: (response: BlobPart) => {
      const file = new Blob([response]);
      downloadFile(file, 'Leave History.csv');
    },
  });

  const handleExport = () => {
    if (selectedRowIds.length > 0) {
      mutate(selectedRowIds);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter ..."
          value={searchTerm}
          onChange={event => onSearch(event.target.value)}
          inputClassName="h-8 w-[150px] lg:w-[250px]"
          loading={searchLoading}
        />

        {(isFiltered || searchTerm) && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              onSearch('');
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>
      {selectedRowIds.length > 0 && (
        <LoadingButton
          variant="outline"
          size="sm"
          className="ml-auto mr-2 flex h-8"
          onClick={handleExport}
          disabled={isPending}
          loading={isPending}
        >
          <FileDown className="mr-2 size-4" />
          Export
        </LoadingButton>
      )}
      <DataTableViewOptions table={table} />
    </div>
  );
}
