'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { EmployeePayrollListType } from '@/libs/validations/employee';

import { EmployeePayrollListRowActions } from '../actions/employeePaytroll-list.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return 'Rs. 0.00';
  return `Rs. ${amount.toLocaleString('en-PK', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
};

export const employeePayrollColumns: ColumnDef<EmployeePayrollListType>[] = [
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
    accessorKey: 'Date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Month" />
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue('Date');

      // Type guard to ensure dateValue is a string
      if (typeof dateValue === 'string') {
        const formattedDate = new Date(dateValue).toLocaleString('en-US', {
          month: 'long',
        });

        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {formattedDate}
            </span>
          </div>
        );
      }
    },
  },

  {
    accessorKey: 'Basic_Salary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Basic Salary" />
    ),
    cell: ({ row }) => {
      const basicSalary = row.getValue('Basic_Salary');
      if (
        typeof basicSalary === 'number' ||
        typeof basicSalary === 'undefined'
      ) {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {formatCurrency(basicSalary)}
            </span>
          </div>
        );
      }
    },
  },

  {
    accessorKey: 'Tax_Amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tax Amount" />
    ),
    cell: ({ row }) => {
      const taxAmount = row.getValue('Tax_Amount');
      if (typeof taxAmount === 'number' || typeof taxAmount === 'undefined') {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {formatCurrency(taxAmount)}
            </span>
          </div>
        );
      }
    },
  },

  {
    accessorKey: 'Working_Days',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Working Days" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('Working_Days')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'Total_SalaryDeducton',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Deduction" />
    ),
    cell: ({ row }) => {
      const totalDeduction = row.getValue('Total_SalaryDeducton');
      if (
        typeof totalDeduction === 'number' ||
        typeof totalDeduction === 'undefined'
      ) {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {formatCurrency(totalDeduction)}
            </span>
          </div>
        );
      }
    },
  },

  {
    accessorKey: 'Net_Salary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Net Salary" />
    ),
    cell: ({ row }) => {
      const netSalary = row.getValue('Net_Salary');
      if (typeof netSalary === 'number' || typeof netSalary === 'undefined') {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {formatCurrency(netSalary)}
            </span>
          </div>
        );
      }
    },
  },
  {
    accessorKey: 'Paid_Amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid Amount" />
    ),
    cell: ({ row }) => {
      const paidAmount = row.getValue('Paid_Amount');
      if (typeof paidAmount === 'number' || typeof paidAmount === 'undefined') {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {formatCurrency(paidAmount)}
            </span>
          </div>
        );
      }
    },
  },
  {
    accessorKey: 'Pay_Status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pay Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge
            variant={
              row.getValue('Pay_Status') === 'Paid' ? 'success' : 'error'
            }
          >
            {row.getValue('Pay_Status')}
          </Badge>
        </div>
      );
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <EmployeePayrollListRowActions row={row} />,
  },
];
