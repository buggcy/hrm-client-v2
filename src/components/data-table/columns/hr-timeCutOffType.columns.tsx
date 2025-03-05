'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { ConfigurationType } from '@/libs/validations/hr-configuration';

import { DataTableColumnHeader } from '../data-table-column-header';

export const timeCutOffTypeColumns: ColumnDef<ConfigurationType>[] = [
  {
    accessorKey: 'timeCutOff',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time in Minutes" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue('timeCutOff')} Minutes
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'timeCutOff',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time in Hours" />
    ),
    cell: ({ row }) => {
      const time = row.original?.timeCutOff || 0;
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
    accessorKey: 'startTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Time" />
    ),
    cell: ({ row }) => {
      const field = row.getValue('startTime');
      return (
        <div className="flex items-center space-x-2">
          {field ? (
            <span className="max-w-[500px] truncate font-medium capitalize">
              {row.getValue('startTime')}
            </span>
          ) : (
            <span className="italic text-gray-500">Not Provided!</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'endTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Time" />
    ),
    cell: ({ row }) => {
      const field = row.getValue('endTime');
      return (
        <div className="flex items-center space-x-2">
          {field ? (
            <span className="max-w-[500px] truncate font-medium capitalize">
              {row.getValue('endTime')}
            </span>
          ) : (
            <span className="italic text-gray-500">Not Provided!</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    cell: ({ row }) => {
      const firstName = row.original?.userId?.firstName;
      const lastName = row.original?.userId.lastName;
      const avatar = row.original?.userId?.Avatar;
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
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('createdAt')));
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
];
