'use client';

import { ColumnDef } from '@tanstack/react-table';

import { employee_status } from '@/components/filters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { EmployeeListType } from '@/libs/validations/employee';

import { UnapprovedEmployeeRowActions } from '../actions/unapproved-employee.action';
import { DataTableColumnHeader } from '../data-table-column-header';

export const unapprovedEmployeeColumns: ColumnDef<EmployeeListType>[] = [
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
    accessorKey: 'Joining_Date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joining Date" />
    ),
    cell: ({ row }) => {
      const joinDateValue = row.getValue('Joining_Date');

      if (!joinDateValue) {
        return <span className="italic text-gray-500">No Date Available</span>;
      }
      const joinDate = new Date(Date.parse(row.getValue('Joining_Date')));

      const currentDate = new Date();
      let ageYears = currentDate.getFullYear() - joinDate.getFullYear();
      let ageMonths = currentDate.getMonth() - joinDate.getMonth();
      let ageDays = currentDate.getDate() - joinDate.getDate();

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
            {joinDate.toDateString()}
          </span>
        </div>
      );
    },
  },

  //   {
  //     accessorKey: 'basicSalary',
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Basic Salary" />
  //     ),
  //     cell: ({ row }) => {
  //       const salary = Number(row.getValue('basicSalary'));

  //       const formattedSalary = !isNaN(salary)
  //         ? new Intl.NumberFormat('en-IN').format(salary)
  //         : 'N/A';

  //       return (
  //         <div className="flex space-x-2">
  //           <span className="max-w-[500px] truncate font-medium">
  //             RS {formattedSalary}
  //           </span>
  //         </div>
  //       );
  //     },
  //   },

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
    accessorKey: 'isApproved',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = employee_status.find(
        status => status.value === row.getValue('isApproved'),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[120px] items-center">
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
    cell: ({ row }) => <UnapprovedEmployeeRowActions row={row} />,
  },
];
