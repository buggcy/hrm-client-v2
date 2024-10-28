'use client';

import { ColumnDef } from '@tanstack/react-table';

import { ExtraLeaveType } from '@/libs/validations/manage-leave';

import { ManageLeaveRowActions } from '../actions/manage-leave.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const hrManageLeaveColumns: ColumnDef<ExtraLeaveType>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leave Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('title')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'leavesAllowed',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leave Allowed" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('leavesAllowed')}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'leavesTaken',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leave Taken" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('leavesTaken')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'month',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leave For Month" />
    ),
    cell: ({ row }) => {
      const month: number | undefined = row.getValue<number>('month');
      const validMonth =
        month !== undefined && month >= 1 && month <= 12 ? month : 1;
      const date = new Date(0, validMonth - 1);
      const formattedMonth = date.toLocaleString('en-US', { month: 'long' });
      return (
        <div className="flex items-center space-x-2">
          <span className="max-w-[500px] truncate">{formattedMonth}</span>
        </div>
      );
    },
  },

  {
    accessorKey: 'year',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leave For Month" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="max-w-[500px] truncate">{row.getValue('year')}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <ManageLeaveRowActions row={row} />,
  },
];
