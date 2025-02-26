'use client';

import { ColumnDef } from '@tanstack/react-table';

import { project_status_options } from '@/components/filters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { ProjectListType } from '@/libs/validations/project-department';

import { ProjectRowActions } from '../actions/project.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const ProjectColumns: ColumnDef<ProjectListType>[] = [
  {
    accessorKey: 'projectName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('projectName')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'teamLead',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team Lead" />
    ),
    cell: ({ row }) => {
      const firstName = row.original?.teamLead?.firstName;
      const lastName = row.original?.teamLead?.lastName;
      const avatar = row.original?.teamLead?.Avatar;
      const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
      const field = row.getValue('teamLead');
      return (
        <>
          {field ? (
            <div className="flex items-center space-x-2">
              <Avatar className="size-8">
                <AvatarImage
                  src={avatar || ''}
                  alt={`${firstName} ${lastName}`}
                />
                <AvatarFallback className="uppercase">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <span className="max-w-[500px] truncate font-medium capitalize">
                {`${firstName} ${lastName}`}
              </span>
            </div>
          ) : (
            <span className="italic text-gray-500">No Team Lead Available</span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Created" />
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
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('startDate')));
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Status" />
    ),
    cell: ({ row }) => {
      const status = project_status_options.find(
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
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive');
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <ProjectRowActions row={row} />,
  },
];
