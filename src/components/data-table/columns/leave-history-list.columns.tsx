'use client';

import { ColumnDef } from '@tanstack/react-table';

import { leave_history_status_options } from '@/components/filters';
import { Checkbox } from '@/components/ui/checkbox';

import { LeaveHistoryListType } from '@/libs/validations/leave-history';

import { DataTableColumnHeader } from '../data-table-column-header';

export const leaveHistoryListColumns: ColumnDef<LeaveHistoryListType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'Title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('Title')}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'Leave_Type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leave Type" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('Leave_Type')}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'Start_Date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('Start_Date')));

      return (
        <div className="flex items-center space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {field?.toDateString()}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'End_Date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('End_Date')));

      return (
        <div className="flex items-center space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {field?.toDateString()}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'Status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = leave_history_status_options.find(
        status => status.value === row.getValue('Status'),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 size-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
