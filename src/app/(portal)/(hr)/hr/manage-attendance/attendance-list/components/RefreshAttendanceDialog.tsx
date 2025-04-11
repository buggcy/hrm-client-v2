'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomDayPicker from '@/components/CustomDayPicker';
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
import { refreshAttendance } from '@/services/hr/attendance-list.service';
import { AttendanceListStoreType } from '@/stores/hr/attendance-list';

import { MessageErrorResponse } from '@/types';

const refreshAttendanceSchema = z.object({
  employee: z.array(z.string()).min(1, 'At least one employee is required'),
  fromDate: z.date(),
  toDate: z.date(),
});

export type RefreshAttendanceFormData = z.infer<typeof refreshAttendanceSchema>;

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
}

export function RefreshAttendanceDialog({
  open,
  onOpenChange,
  onCloseChange,
}: AttendanceDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RefreshAttendanceFormData>({
    resolver: zodResolver(refreshAttendanceSchema),
    defaultValues: {
      employee: [],
      fromDate: new Date(),
      toDate: new Date(),
    },
  });

  const { attendanceListStore } = useStores() as {
    attendanceListStore: AttendanceListStoreType;
  };
  const { setRefetchAttendanceList } = attendanceListStore;

  const { mutate, isPending } = useMutation({
    mutationFn: refreshAttendance,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on adding attendance!',
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
      setRefetchAttendanceList(true);
    },
  });

  const onSubmit = (data: RefreshAttendanceFormData) => {
    mutate({
      userIds: selectedEmployees,
      from: data.fromDate.toLocaleDateString('en-CA'),
      to: data.toDate.toLocaleDateString('en-CA'),
    });
  };

  const { data: users, isLoading } = useAttendanceUsersQuery();

  interface Employee {
    id: string;
    name: string;
    email?: string;
    avatar: string;
    Tahometer_ID?: string;
  }

  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = React.useState<string[]>(
    [],
  );
  const [isAllSelected, setIsAllSelected] = React.useState(false);
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
    // const selectedEmps = employees.filter(emp => selectedIds.includes(emp.id));
    // const selectedEmpIds = selectedEmps.map(emp => emp.Tahometer_ID || '');
    setSelectedEmployees(selectedIds);
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
          <DialogTitle>Refresh Attendance</DialogTitle>
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
              <Label htmlFor="fromDate" className="mb-2 text-left">
                From <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="fromDate"
                control={control}
                render={({ field }) => (
                  <CustomDayPicker
                    initialDate={field.value}
                    onDateChange={field.onChange}
                    className="h-auto"
                    disabled={date =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                  />
                )}
              />
              {errors.fromDate && (
                <span className="text-sm text-red-500">
                  {errors.fromDate.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="toDate" className="mb-2 text-left">
                To <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="toDate"
                control={control}
                render={({ field }) => (
                  <CustomDayPicker
                    initialDate={field.value}
                    onDateChange={field.onChange}
                    className="h-auto"
                    disabled={date =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                  />
                )}
              />
              {errors.toDate && (
                <span className="text-sm text-red-500">
                  {errors.toDate.message}
                </span>
              )}
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
