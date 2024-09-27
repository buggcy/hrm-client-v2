'use client';

import { ColumnDef } from '@tanstack/react-table';

import { gender_options } from '@/components/filters';
import { Checkbox } from '@/components/ui/checkbox';

import { EmployeeListType } from '@/libs/validations/employee';

import { DataTableColumnHeader } from '../data-table-column-header';

export const employeeListColumns: ColumnDef<EmployeeListType>[] = [
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
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('firstName')}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'companyEmail',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('companyEmail')}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'contactNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('contactNo')}
          </span>
        </div>
      );
    },
  },

  // {
  //   accessorKey: 'DOB',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Date of Birth" />
  //   ),
  //   cell: ({ row }) => {
  //     const field = row.getValue('DOB');
  //     return <div>{field?.toDateString()}</div>;
  //   },
  // },

  {
    accessorKey: 'Gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      const status = gender_options.find(
        status => status.value === row.getValue('Gender'),
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

  //   {
  //     id: 'actions',
  //     cell: ({ row }) => <DataTableRowActions row={row} />,
  //   },
];
