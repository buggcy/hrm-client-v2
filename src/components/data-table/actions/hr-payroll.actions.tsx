'use client';

import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import {
  Eye,
  HandCoins,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import moment from 'moment';
import { createRoot } from 'react-dom/client';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingButton } from '@/components/LoadingButton';
import ConfirmDialog from '@/components/modals/cancel-modal';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import Payslip from '@/app/(portal)/(employee)/employee/payroll/components/Payslip/Payslip';
import { EmployeePayrollListType } from '@/libs/validations/employee';
import { HRPayrollListType } from '@/libs/validations/hr-payroll';
import {
  deletePayroll,
  refreshPayroll,
} from '@/services/hr/hr-payroll.service';
import { payPayroll } from '@/services/hr/payroll.service';
import { AuthStoreType } from '@/stores/auth';
import { EmployeeStoreType } from '@/stores/hr/employee';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<EmployeePayrollListType> | Row<HRPayrollListType>;
}

const BaseFormSchema = z.object({
  amountToBePaid: z.string().min(1, 'Amount is required'),
  payrollId: z.string().min(1, 'Id is required'),
});

export type PayFormData = z.infer<typeof BaseFormSchema>;

const FormSchema = (netSalary: number) =>
  BaseFormSchema.extend({
    amountToBePaid: z
      .string()
      .min(1, 'Amount is required')
      .refine(value => !isNaN(Number(value)) && Number(value) > 0, {
        message: 'Amount must be a number greater than 0',
      })
      .refine(value => Number(value) <= netSalary, {
        message: `Amount cannot exceed ${netSalary}`,
      }),
  });

export function HRPayrollListRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);

  const [showPayDialog, setShowPayDialog] = React.useState<boolean>(false);

  const data = row.original;

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const { employeeStore } = useStores() as {
    authStore: AuthStoreType;
    employeeStore: EmployeeStoreType;
  };

  const { setRefetchEmployeeList } = employeeStore;

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
          employeeDesignation={data?.Emp_ID?.Designation || 'N/A'}
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

  const schema =
    data?.Net_Salary !== undefined
      ? FormSchema(data.Net_Salary)
      : BaseFormSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PayFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amountToBePaid: data.Net_Salary?.toString(),
      payrollId: data._id,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: payPayroll,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on pay request!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      reset();
      setRefetchEmployeeList(true);
      setShowPayDialog(false);
    },
  });

  const { mutate: RefreshMutate } = useMutation({
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
      setRefetchEmployeeList(true);
    },
  });

  const { mutate: deleteMutate, isPending: isDelete } = useMutation({
    mutationFn: deletePayroll,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on deleting payroll!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchEmployeeList(true);
      setShowDeleteDialog(false);
    },
  });

  const handleDelete = () => {
    deleteMutate(data?._id);
  };
  const handlePay = (data: PayFormData) => {
    mutate(data);
  };
  const handleRefresh = (row: HRPayrollListType) => {
    const month = moment(row?.Date).format('MM');
    const year = moment(row?.Date).format('YYYY');
    RefreshMutate({
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
          {data.Pay_Status === 'Unpaid' ? (
            <DropdownMenuItem
              onSelect={() => {
                setShowPayDialog(true);
              }}
            >
              <HandCoins className="mr-2 size-4" />
              Pay
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DialogTrigger asChild onClick={handleViewPayslip}>
            <DropdownMenuItem>
              <Eye className="mr-2 size-4" />
              View Payslip
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger
            asChild
            onClick={() => handleRefresh(data as HRPayrollListType)}
          >
            <DropdownMenuItem>
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600"
              onSelect={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 size-4" />
              Delete Payroll
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Delete'}
        isPending={isDelete}
        description={'Are your sure you want to delete this payroll?'}
        handleDelete={handleDelete}
      />
      <AlertDialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <form>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle> Pay Salary</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="grid gap-8 py-4">
                  <div className="flex flex-wrap">
                    <div className="flex flex-1 flex-col">
                      <Label
                        htmlFor="amountToBePaid"
                        className="mb-2 text-left"
                      >
                        Amount
                      </Label>
                      <Controller
                        name="amountToBePaid"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            id="amountToBePaid"
                            placeholder={'Enter Amount'}
                            {...field}
                          />
                        )}
                      />
                      <div className="flex justify-start p-1">
                        {errors.amountToBePaid && (
                          <span className="text-sm text-red-500">
                            {errors.amountToBePaid.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowPayDialog(false);
                }}
              >
                Close
              </AlertDialogCancel>

              <LoadingButton
                type="button"
                variant="default"
                loading={isPending}
                disabled={isPending}
                onClick={handleSubmit(handlePay)}
              >
                {'Pay'}
              </LoadingButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </form>
      </AlertDialog>
    </Dialog>
  );
}
