'use client';

import * as React from 'react';

import { Row } from '@tanstack/react-table';
import { Eye, MoreHorizontal } from 'lucide-react';
import { createRoot } from 'react-dom/client';

import DeleteDialog from '@/components/modals/delete-modal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStores } from '@/providers/Store.Provider';

import Payslip from '@/app/(portal)/(employee)/employee/payroll/components/Payslip/Payslip';
import { EmployeePayrollListType } from '@/libs/validations/employee';
import { deleteEmployeeRecord } from '@/services/hr/employee.service';
import { AuthStoreType } from '@/stores/auth';
import { EmployeePayrollStoreType } from '@/stores/employee/employeePayroll';

interface DataTableRowActionsProps {
  row: Row<EmployeePayrollListType>;
}

export function EmployeePayrollListRowActions({
  row,
}: DataTableRowActionsProps) {
  const { employeePayrollStore } = useStores() as {
    employeePayrollStore: EmployeePayrollStoreType;
  };
  const { setRefetchEmployeePayrollList } = employeePayrollStore;
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const data = row.original;

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const handleViewPayslip = () => {
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      alert('Please allow popups for this website');
      return;
    }

    const payslipData = data;

    newWindow.document.body.innerHTML = `<div id="payslip-root"></div>`;

    const link = newWindow.document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    newWindow.document.head.appendChild(link);

    const rootElement = newWindow.document.getElementById('payslip-root');
    if (rootElement) {
      const root = createRoot(rootElement);

      root.render(
        <Payslip
          payslipDate={data.Date ? formatDate(data.Date) : 'N/A'}
          date={today || ''}
          employeeName={data.Employee_Name || 'N/A'}
          employeeDesignation={user?.Designation || 'N/A'}
          employeeDepartment={'N/A'}
          basicSalary={data.Basic_Salary || 0}
          absentDeduction={data.Absent_Deduction || 0}
          incentivePay={0}
          professionalTax={0}
          houseRentAllowance={0}
          loan={0}
          mealAllowance={0}
          totalEarnings={0}
          totalAfterTax={data.Tax_Amount || 0}
          salaryDeduction={data.Total_SalaryDeducton || 0}
          paymentStatus={data.Pay_Status || 'N/A'}
          {...payslipData}
        />,
      );
    } else {
      console.error('Element with ID "payslip-root" not found.');
    }
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild onClick={handleViewPayslip}>
            <DropdownMenuItem>
              <Eye className="mr-2 size-4" />
              View Payslip
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <DeleteDialog
        id={data._id}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        mutationFunc={deleteEmployeeRecord}
        setRefetch={setRefetchEmployeePayrollList}
      />
    </Dialog>
  );
}
