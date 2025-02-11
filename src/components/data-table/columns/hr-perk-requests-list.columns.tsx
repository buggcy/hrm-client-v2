'use client';

import { ColumnDef } from '@tanstack/react-table';

import { perk_status_options } from '@/components/filters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { HrPerkRequestListType } from '@/libs/validations/hr-perks';

import { PerkRequestListRowActions } from '../actions/hr-perk-requests-list.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

import { AttendanceUser } from '@/types/attendance-list.types';

export const hrPerkListColumns: ColumnDef<HrPerkRequestListType>[] = [
  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee" />
    ),
    cell: ({ row }) => {
      const user: AttendanceUser = row.getValue('userId');
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue('name')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'incrementAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('incrementAmount')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'dateApplied',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Applied" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('dateApplied')));
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
    accessorKey: 'decisionDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Approved" />
    ),
    cell: ({ row }) => {
      const dateType = row.getValue('decisionDate');
      const field = new Date(Date.parse(row.getValue('decisionDate')));
      const isDateValid = typeof dateType === 'string' && Date.parse(dateType);
      const day = field.toLocaleDateString('en-US', { weekday: 'short' });
      const date = field.toDateString().slice(4);
      return (
        <div>
          {isDateValid ? (
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{day}</Badge>
              <span className="max-w-[500px] truncate">{date}</span>
            </div>
          ) : (
            <p>To be Approved</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'hrApproval',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Request Status" />
    ),
    cell: ({ row }) => {
      const status = perk_status_options.find(
        status => status.value === row.getValue('hrApproval'),
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
    cell: ({ row }) => <PerkRequestListRowActions row={row} />,
  },
];
