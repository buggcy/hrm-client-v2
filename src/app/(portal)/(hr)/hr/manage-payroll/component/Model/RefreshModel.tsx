'use client';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { MonthPickerComponent } from '@/components/MonthPicker';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import MultiSelectEmployee from '@/components/ui/employee-select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useAttendanceUsersQuery } from '@/hooks/attendanceList/useEmployeesList.hook';
import { refreshPayroll } from '@/services/hr/hr-payroll.service';
import { EmployeeStoreType } from '@/stores/hr/employee';

import { MessageErrorResponse } from '@/types';

const refreshSchema = z.object({
  employee: z.array(z.string()).min(1, 'At least one employee is required'),
});

export type RefreshFormData = z.infer<typeof refreshSchema>;

interface DialogProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
}
interface Employee {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  Tahometer_ID?: string;
}

export function RefreshPayrollDialog({
  open,
  onOpenChange,
  onCloseChange,
}: DialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RefreshFormData>({
    resolver: zodResolver(refreshSchema),
    defaultValues: {
      employee: [],
    },
  });
  const { data: users, isLoading } = useAttendanceUsersQuery();

  const { employeeStore } = useStores() as { employeeStore: EmployeeStoreType };
  const { setRefetchEmployeeList } = employeeStore;
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = React.useState<string[]>(
    [],
  );
  const [isAllSelected, setIsAllSelected] = React.useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const setDateValue = (selectedDate: Date | null) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  const { mutate, isPending } = useMutation({
    mutationFn: refreshPayroll,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on refreshing the payroll!',
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
      onCloseChange();
      setIsAllSelected(false);
      setRefetchEmployeeList(true);
    },
  });

  useEffect(() => {
    if (!open) {
      setDate(new Date());
      setSelectedEmployees([]);
    }
  }, [open]);

  useEffect(() => {
    if (users?.users && users.users.length > 0) {
      const updatedEmployees = users.users.map(user => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.companyEmail,
        avatar: user.Avatar || '',
        Tahometer_ID: user.Tahometer_ID || '',
      }));
      setEmployees(updatedEmployees);
    }
  }, [users]);

  const handleEmployeeChange = (selectedIds: string[]) => {
    const selectedEmps = employees.filter(emp => selectedIds.includes(emp.id));
    const selectedEmpIds = selectedEmps.map(emp => emp.Tahometer_ID || '');
    setSelectedEmployees(selectedEmpIds);
  };

  useEffect(() => {
    if (isAllSelected) {
      setSelectedEmployees(employees.map(emp => emp.Tahometer_ID || ''));
      setValue(
        'employee',
        employees.map(emp => emp.id),
      );
    }
  }, [employees, isAllSelected, setValue]);

  const onSubmit = () => {
    const month = moment(date).format('MM');
    const year = moment(date).format('YYYY');
    mutate({
      userIds: selectedEmployees,
      month,
      year,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        reset();
        setIsAllSelected(false);
        setSelectedEmployees([]);
        onOpenChange();
      }}
    >
      <DialogContent className="md:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Refresh Payroll</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-1 flex-col">
              <div className="mb-1 flex flex-row items-center justify-between">
                <Label htmlFor="employee" className="mb-2 text-left">
                  Select Employee <span className="text-red-600">*</span>
                </Label>
                <div className="flex flex-row items-center gap-2">
                  <Label htmlFor="allEmployees" className="-mb-0.5">
                    Select All
                  </Label>
                  <Checkbox
                    id="allEmployees"
                    checked={isAllSelected}
                    onCheckedChange={() => {
                      setIsAllSelected(!isAllSelected);
                    }}
                  />
                </div>
              </div>
              <Controller
                name="employee"
                control={control}
                render={({ field }) => (
                  <MultiSelectEmployee
                    label="Add Employees"
                    options={employees}
                    selectedValues={field.value || []}
                    onChange={(selectedIds: string[]) => {
                      field.onChange(selectedIds);
                      handleEmployeeChange(selectedIds);
                    }}
                    // disabled={isAllSelected}
                  />
                )}
              />
              {errors.employee && (
                <span className="text-sm text-red-500">
                  {errors.employee.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="date" className="mb-2 text-left">
                Date <span className="text-red-600">*</span>
              </Label>
              <MonthPickerComponent
                setDateValue={setDateValue}
                initialDate={date}
                minDate={new Date(0, 0, 1)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending || isLoading}>
              Refresh
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
