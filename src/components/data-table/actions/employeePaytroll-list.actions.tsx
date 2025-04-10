'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Eye, MoreHorizontal, RefreshCw } from 'lucide-react';
import moment from 'moment';
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
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import Payslip from '@/app/(portal)/(employee)/employee/payroll/components/Payslip/Payslip';
import { EmployeePayrollListType } from '@/libs/validations/employee';
import { deleteEmployeeRecord } from '@/services/hr/employee.service';
import { refreshPayroll } from '@/services/hr/hr-payroll.service';
import { AuthStoreType } from '@/stores/auth';
import { EmployeePayrollStoreType } from '@/stores/employee/employeePayroll';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<EmployeePayrollListType>;
}

export function EmployeePayrollListRowActions({
  row,
}: DataTableRowActionsProps) {
  const { employeePayrollStore } = useStores() as {
    employeePayrollStore: EmployeePayrollStoreType;
  };
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const { setRefetchEmployeePayrollList } = employeePayrollStore;
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const data = row.original;

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

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
      const departmentNames =
        data?.Emp_ID?.dep_ID &&
        data?.Emp_ID?.dep_ID
          .map(dept => dept.departmentName.replace(' Department', ''))
          .join(', ');
      const basicSalary = payslipData.Basic_Salary || 0;

      root.render(
        <Payslip
          payslipDate={
            payslipData.Date
              ? new Date(payslipData.Date).toLocaleString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })
              : 'N/A'
          }
          date={today || ''}
          employeeName={payslipData.Employee_Name || 'N/A'}
          employeeDesignation={user?.Designation || 'N/A'}
          employeeDepartment={departmentNames || 'N/A'}
          basicSalary={basicSalary}
          absentDeduction={payslipData.Absent_Deduction || 0}
          totalEarnings={payslipData.Net_Salary || 1}
          netSalary={payslipData.Net_Salary || 0}
          salaryDeduction={payslipData.Total_SalaryDeducton || 0}
          paymentStatus={payslipData.Pay_Status || 'N/A'}
          perks={payslipData?.perks || { increments: [], decrements: [] }}
          totalPerkIncrement={payslipData.totalPerkIncrement || 0}
          totalPerkDecrement={payslipData.totalPerkDecrement || 0}
          casualLeaves={payslipData?.Leaves?.casual || 0}
          sickLeaves={payslipData?.Leaves?.sick || 0}
          annualLeaves={payslipData?.Leaves?.annual || 0}
          unpaidLeaves={payslipData?.Leaves?.unpaid || 0}
          taxAmount={payslipData?.Tax_Amount || 0}
          overtimeMinute={payslipData?.overtimeMinute || 0}
          totalOvertime={payslipData?.totalOvertime || 0}
          late={payslipData?.Late || 0}
        />,
      );
    } else {
      console.error('Element with ID "payslip-root" not found.');
    }
  };

  const { mutate } = useMutation({
    mutationFn: refreshPayroll,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on refreshing the Payroll!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchEmployeePayrollList(true);
    },
  });
  const handleRefresh = (row: EmployeePayrollListType) => {
    const month = moment(row?.Date).format('MM');
    const year = moment(row?.Date).format('YYYY');
    mutate({
      userIds: [row?.User_ID || ''],
      month,
      year,
    });
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
          <DialogTrigger asChild onClick={() => handleRefresh(data)}>
            <DropdownMenuItem>
              <RefreshCw className="mr-2 size-4" />
              Refresh
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
