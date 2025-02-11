'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';

import { HrPerksListType } from '@/libs/validations/hr-perks';

import { HrPerkListRowActions } from '../actions/hr-perk-list-actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const hrPerkListColumns: ColumnDef<HrPerksListType>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('name')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('description')}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'salaryIncrement',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Increment" />
    ),
    cell: ({ row }) => {
      const isTrue: boolean = row.getValue('salaryIncrement');
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {isTrue ? <Check /> : <X />}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'salaryDecrement',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Decrement" />
    ),
    cell: ({ row }) => {
      const isTrue: boolean = row.getValue('salaryDecrement');
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {isTrue ? <Check /> : <X />}
          </span>
        </div>
      );
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <HrPerkListRowActions row={row} />,
  },
];
