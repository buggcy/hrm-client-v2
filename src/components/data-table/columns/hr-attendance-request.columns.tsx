'use client';

import { ColumnDef } from '@tanstack/react-table';

import { attendance_request_status_options } from '@/components/filters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { AttendanceUser } from '@/libs/validations/attendance-list';
import { AttendanceRequest } from '@/libs/validations/attendance-request';

import { AttendanceRequestRowActions } from '../actions/attendance-request.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const hrAttendanceRequestListColumns: ColumnDef<AttendanceRequest>[] = [
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
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('date')));

      const day = field.toLocaleDateString('en-US', { weekday: 'short' }); // Extracts day like "Mon", "Tue", etc.
      const date = field.toDateString().slice(4); // Extracts rest of the date like "Sep 28 2024"

      return (
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{day}</Badge>
          <span className="max-w-[500px] truncate">{date}</span>
        </div>
      );
    },
  },

  {
    accessorKey: 'Total_Time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Time" />
    ),
    cell: ({ row }) => {
      const totalTimeStr = row.getValue('Total_Time');
      let totalTimeInMinutes = 0;
      if (typeof totalTimeStr === 'string') {
        totalTimeInMinutes = parseInt(totalTimeStr, 10);
      }

      const hours = Math.floor(totalTimeInMinutes / 60);
      const minutes = totalTimeInMinutes % 60;

      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {`${formattedHours}:${formattedMinutes}`}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'Start_Date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Time" />
    ),
    cell: ({ row }) => {
      const date = new Date(Date.parse(row.getValue('Start_Date')));

      const time = date.toLocaleTimeString('en-PK', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Asia/Karachi',
      });
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{time}</span>
        </div>
      );
    },
  },

  {
    accessorKey: 'End_Date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Time" />
    ),
    cell: ({ row }) => {
      const date = new Date(Date.parse(row.getValue('End_Date')));
      const endDate = row.getValue('End_Date');
      const time = date.toLocaleTimeString('en-PK', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Asia/Karachi',
      });
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {!endDate ? 'N/A' : time}
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
      const status = attendance_request_status_options.find(
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
    cell: ({ row }) => <AttendanceRequestRowActions row={row} />,
  },
];
