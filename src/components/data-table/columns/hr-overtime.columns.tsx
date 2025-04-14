'use client';

import { ColumnDef } from '@tanstack/react-table';

import { overtime_options } from '@/components/filters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { AttendanceUser } from '@/libs/validations/attendance-list';
import { OvertimeListType } from '@/libs/validations/overtime';

import { OvertimeRowActions } from '../actions/overtime.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const hrOvertimeColumns: ColumnDef<OvertimeListType>[] = [
  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const user: AttendanceUser | null = row.getValue('userId') || null;

      if (!user || Object.keys(user).length === 0) {
        return <span className="italic text-gray-500">User not available</span>;
      }
      const firstName = user?.firstName;
      const lastName = user?.lastName;
      const avatar = user?.Avatar;
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
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Overtime Date" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('date')));
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
    accessorKey: 'overtimeMinutes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time in Minutes" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue('overtimeMinutes')} Minutes
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'overtimeMinutes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time in Hours" />
    ),
    cell: ({ row }) => {
      const time = row.original?.overtimeMinutes || 0;
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      return (
        <div className="flex items-center space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {`${hours} Hours ${minutes} Minutes`}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'reason',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Overtime Reason" />
    ),
    cell: ({ row }) => {
      const reason = row.getValue('reason');
      return (
        <div className="flex space-x-2">
          <span
            className="max-w-[500px] truncate font-medium"
            dangerouslySetInnerHTML={{
              __html: reason || '',
            }}
          ></span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = overtime_options.find(
        status => status.value === row.getValue('status'),
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
    cell: ({ row }) => <OvertimeRowActions row={row} />,
  },
];
