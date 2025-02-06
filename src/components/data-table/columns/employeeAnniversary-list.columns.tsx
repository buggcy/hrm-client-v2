'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { EmployeeDobTableListType } from '@/libs/validations/employee';

import { DataTableColumnHeader } from '../data-table-column-header';

export const employeeAnniversaryListColumns: ColumnDef<EmployeeDobTableListType>[] =
  [
    {
      accessorKey: 'firstName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const firstName: string = row.getValue('firstName');
        const first = row.original.firstName;
        const lastName = row.original.lastName;
        const initials = `${first?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;

        return (
          <div className="flex items-center space-x-2">
            <Avatar className="size-8">
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
      accessorKey: 'Joining_Date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Anniversary Date" />
      ),
      cell: ({ row }) => {
        const field = new Date(Date.parse(row.getValue('Joining_Date')));
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
      accessorKey: 'Joining_Date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Remaining Time" />
      ),
      cell: ({ row }) => {
        const dobString: string = row.getValue('Joining_Date');
        const dob = new Date(dobString);
        const currentDate = new Date();

        dob.setFullYear(currentDate.getFullYear());

        if (dob < currentDate) {
          dob.setFullYear(currentDate.getFullYear() + 1);
        }

        const diffTime = dob.getTime() - currentDate.getTime();

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let displayText = '';

        if (diffDays === 0) {
          displayText = 'Today';
        } else if (diffDays === 1) {
          displayText = 'Tomorrow';
        } else if (diffDays === -1) {
          displayText = 'Yesterday';
        } else {
          const startDate = new Date(currentDate);
          const endDate = new Date(dob);

          let months = endDate.getMonth() - startDate.getMonth();
          const years = endDate.getFullYear() - startDate.getFullYear();
          months += years * 12;

          const tempDate = new Date(startDate);
          tempDate.setMonth(tempDate.getMonth() + months);

          if (tempDate > endDate) {
            months--;
            tempDate.setMonth(tempDate.getMonth() - 1);
          }

          const remainingDays = Math.ceil(
            (endDate.getTime() - tempDate.getTime()) / (1000 * 3600 * 24),
          );

          const weeks = Math.floor(remainingDays / 7);
          const days = remainingDays % 7;

          const parts = [];
          if (months > 0)
            parts.push(`${months} month${months !== 1 ? 's' : ''}`);
          if (weeks > 0) parts.push(`${weeks} week${weeks !== 1 ? 's' : ''}`);
          if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);

          displayText = `${parts.join(', ')} left`;
        }

        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {displayText}
            </span>
          </div>
        );
      },
    },
  ];
