'use client';

import { ColumnDef } from '@tanstack/react-table';

import { leave_history_status_options } from '@/components/filters';
import { Badge } from '@/components/ui/badge';

import { LeaveListType } from '@/libs/validations/hr-leave-list';

import { LeaveHistoryRowActions } from '../actions/employee-leave-history.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const leaveHistoryListColumns: ColumnDef<LeaveListType>[] = [
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
      const day = field.toLocaleDateString('en-US', { weekday: 'short' });
      const date = field.toDateString().slice(4);

      return (
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{day}</Badge>
          <span className="max-w-[500px] truncate">{date}</span>
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
      const day = field.toLocaleDateString('en-US', { weekday: 'short' });
      const date = field.toDateString().slice(4);

      return (
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{day}</Badge>
          <span className="max-w-[500px] truncate">{date}</span>
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

  {
    id: 'actions',
    cell: ({ row }) => <LeaveHistoryRowActions row={row} />,
  },
];
