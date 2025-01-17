'use client';

import { ColumnDef } from '@tanstack/react-table';

import { gender_options } from '@/components/filters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { EmployeeListType } from '@/libs/validations/employee';

import { EmployeeListRowActions } from '../actions/employee-list.actions';
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
      const firstName: string = row.getValue('firstName');
      const first = row.original.firstName;
      const lastName = row.original.lastName;
      const avatar = row.original.Avatar;
      const initials = `${first?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;

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

  {
    accessorKey: 'DOB',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
    cell: ({ row }) => {
      const dob = new Date(Date.parse(row.getValue('DOB')));
      const dateOfBith = row.getValue('DOB');

      if (!dateOfBith) {
        return <span className="italic text-gray-500">No Date Available</span>;
      }
      const currentDate = new Date();
      let ageYears = currentDate.getFullYear() - dob.getFullYear();
      let ageMonths = currentDate.getMonth() - dob.getMonth();
      let ageDays = currentDate.getDate() - dob.getDate();

      if (ageDays < 0) {
        ageMonths -= 1;
        const previousMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0,
        );
        ageDays += previousMonth.getDate();
      }

      if (ageMonths < 0) {
        ageYears -= 1;
        ageMonths += 12;
      }

      return (
        <div className="flex space-x-2">
          <Badge
            variant="outline"
            className="whitespace-nowrap"
          >{`${ageYears}Y ${ageMonths}M`}</Badge>
          <span className="max-w-[500px] whitespace-nowrap font-medium">
            {dob.toDateString()}
          </span>
        </div>
      );
    },
  },

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

  {
    accessorKey: 'Designation',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Designation" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('Designation')}
          </span>
        </div>
      );
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <EmployeeListRowActions row={row} />,
  },
];
