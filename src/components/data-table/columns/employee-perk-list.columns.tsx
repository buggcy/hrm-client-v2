'use client';

import { ColumnDef } from '@tanstack/react-table';

import { perk_status_options } from '@/components/filters';

import { PerkListType } from '@/libs/validations/perk';

import { PerkListRowActions } from '../actions/employee-perk-list.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const employeePerkListColumns: ColumnDef<PerkListType>[] = [
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
      return <div>{field?.toDateString()}</div>;
    },
  },
  {
    accessorKey: 'decisionDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Approved" />
    ),
    cell: ({ row }) => {
      const field = row.getValue('decisionDate');
      const isDateValid = typeof field === 'string' && Date.parse(field);
      return (
        <div>
          {isDateValid ? (
            <p>{new Date(field).toDateString()}</p>
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
    cell: ({ row }) => <PerkListRowActions row={row} />,
  },
];
