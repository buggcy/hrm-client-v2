'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { DepartmentListType } from '@/libs/validations/project-department';

import { DepartmentRowActions } from '../actions/department.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const departmentColumns: ColumnDef<DepartmentListType>[] = [
  {
    accessorKey: 'departmentName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue('departmentName')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'departmentHead',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department Head" />
    ),
    cell: ({ row }) => {
      const departmentHead = row.original?.departmentHead?.find(
        head => head.isCurrent,
      );
      const firstName = departmentHead?.user?.firstName;
      const lastName = departmentHead?.user?.lastName;
      const avatar = departmentHead?.user?.Avatar;
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
    accessorKey: 'updatedBy',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    cell: ({ row }) => {
      const firstName = row.original?.updatedBy?.firstName;
      const lastName = row.original?.updatedBy?.lastName;
      const avatar = row.original?.updatedBy?.Avatar;
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
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <DepartmentRowActions row={row} />,
  },
];
