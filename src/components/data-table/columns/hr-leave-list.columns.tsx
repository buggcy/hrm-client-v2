'use client';

import { ColumnDef } from '@tanstack/react-table';

import { leave_history_status_options } from '@/components/filters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { LeaveListType } from '@/libs/validations/hr-leave-list';

import { LeaveListRowActions } from '../actions/hr-leave-list.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const hrLeaveListColumns: ColumnDef<LeaveListType>[] = [
  {
    accessorKey: 'User_ID',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const firstName = row.original?.User_ID?.firstName;
      const lastName = row.original?.User_ID.lastName;
      const avatar = row.original?.User_ID?.Avatar;
      const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;

      return (
        <div className="flex items-center space-x-2">
          <Avatar className="size-8">
            <AvatarImage src={avatar || ''} alt={`${firstName} ${lastName}`} />
            <AvatarFallback className="uppercase">{initials}</AvatarFallback>
          </Avatar>

          <span className="max-w-[500px] truncate font-medium capitalize">
            {`${firstName} ${lastName}`}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'Title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leave Title" />
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
      return <div>{field?.toDateString()}</div>;
    },
  },
  {
    accessorKey: 'End_Date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('End_Date')));
      return <div>{field?.toDateString()}</div>;
    },
  },

  {
    accessorKey: 'Status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leave Status" />
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <LeaveListRowActions row={row} />,
  },
];
