'use client';

import { ColumnDef } from '@tanstack/react-table';

import { complaint_options } from '@/components/filters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { ComplaintListType } from '@/libs/validations/complaint';

import { ComplaintRowActions } from '../actions/complaint.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const complaintColumns: ColumnDef<ComplaintListType>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Complaint Title" />
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
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Complaint Date" />
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
  {
    accessorKey: 'resolvedDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resolved Date" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status');
      const resolvedDate = row.getValue('resolvedDate');
      let content;

      if (status === 'Resolved' && resolvedDate) {
        const field = new Date(Date.parse(row.getValue('resolvedDate')));
        const day = field.toLocaleDateString('en-US', { weekday: 'short' });
        const date = field.toDateString().slice(4);
        content = (
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{day}</Badge>
            <span className="max-w-[500px] truncate">{date}</span>
          </div>
        );
      } else if (status === 'Pending') {
        content = <span className="text-muted-foreground">In Process</span>;
      } else if (status === 'Canceled') {
        content = <span className="text-red-600">-</span>;
      } else {
        content = <span className="text-gray-600">Unknown Status</span>;
      }

      return content;
    },
  },
  {
    accessorKey: 'resolvedBy',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resolved By" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status');
      const firstName = row.original?.resolvedBy?.firstName;
      const lastName = row.original?.resolvedBy?.lastName;
      const avatar = row.original?.resolvedBy?.Avatar;
      const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;

      let content;

      if (status === 'Resolved') {
        content = (
          <div className="flex items-center space-x-2">
            <Avatar className="size-8">
              <AvatarImage
                src={avatar || ''}
                alt={`${firstName} ${lastName}`}
              />
              <AvatarFallback className="uppercase">{initials}</AvatarFallback>
            </Avatar>
            <span className="max-w-[500px] truncate font-medium capitalize">
              {`${firstName} ${lastName}`}
            </span>
          </div>
        );
      } else if (status === 'Pending') {
        content = <span className="text-muted-foreground">Under Review</span>;
      } else if (status === 'Canceled') {
        content = <span className="text-red-600">-</span>;
      } else {
        content = <span className="text-gray-600">Unknown Status</span>;
      }
      return content;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = complaint_options.find(
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
    cell: ({ row }) => <ComplaintRowActions row={row} />,
  },
];
