'use client';

import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ExtraLeaveType } from '@/libs/validations/manage-leave';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchLoading: boolean;
  searchTerm: string;
  onSearch: (term: string) => void;
}

export function ExtraLeaveToolbar<TData extends ExtraLeaveType>({
  table,
  searchTerm,
  onSearch,
  searchLoading,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter ..."
          inputClassName="h-8 w-[150px] lg:w-[250px]"
          value={searchTerm}
          onChange={event => onSearch(event.target.value)}
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
      <DataTableViewOptions table={table} />
    </div>
  );
}
