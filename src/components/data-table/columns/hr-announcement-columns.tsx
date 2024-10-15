'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { AnnouncementType } from '@/libs/validations/hr-announcement';

import { HrAnnouncementRowActions } from '../actions/hr-announcement-actions';
import { DataTableColumnHeader } from '../data-table-column-header';
export const hrAnnouncementColumns: ColumnDef<AnnouncementType>[] = [
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
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
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
    accessorKey: 'StartDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('StartDate')));
      return <div>{field?.toDateString()}</div>;
    },
  },
  {
    accessorKey: 'EndDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('EndDate')));
      return <div>{field?.toDateString()}</div>;
    },
  },
  {
    accessorKey: 'Priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority: string = row.getValue('Priority');
      let icon;
      switch (priority) {
        case 'High':
          icon = <ArrowUp />;
          break;
        case 'Low':
          icon = <ArrowDown />;
          break;
        case 'Medium':
          icon = <ArrowRight />;
          break;
        default:
          icon = null;
      }

      return <div className="flex items-center space-x-2">{icon}</div>;
    },
  },
  {
    accessorKey: 'isEnabled',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isEnabled: boolean = row.getValue('isEnabled');
      return (
        <div className="flex space-x-2">
          <Badge
            variant={row.getValue('isEnabled') === true ? 'success' : 'error'}
          >
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <HrAnnouncementRowActions row={row} />,
  },
];
