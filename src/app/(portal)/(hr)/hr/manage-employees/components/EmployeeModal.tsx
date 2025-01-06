'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ChevronDown } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomDayPicker from '@/components/CustomDayPicker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MultiSelect from '@/components/ui/multiple-select';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useDepartmentListQuery } from '@/hooks/hr/useProjectDepartment.hook';
import { useTypesQuery } from '@/hooks/types.hook';
import { EmployeeListType } from '@/libs/validations/employee';
import {
  addEmployeeData,
  updateTBAEmployeeData,
} from '@/services/hr/employee.service';
import { EmployeeStoreType } from '@/stores/hr/employee';

import { MessageErrorResponse } from '@/types';

// Define the Zod schema
const addEmployeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  companyEmail: z.string().email('Invalid company email address'),
  contactNo: z
    .string()
    .regex(/^(03|\+923)/, 'Contact number must start with "03" or "+923"'),
  basicSalary: z
    .string()
    .min(1, 'Salary is required')
    .regex(/^\d+$/, 'Salary must be a valid number'),
  Joining_Date: z.date(),
  Designation: z.string().min(1, 'Designation is required'),
  dep_ID: z.array(z.string()).min(1, 'Department is required'),
});

export type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
  editData?: EmployeeListType;
}

export function AddEmployeeDialog({
  open,
  onOpenChange,
  onCloseChange,
  editData,
}: AddEmployeeDialogProps) {
  const { data: types, isLoading } = useTypesQuery();
  const { data: departmentList } = useDepartmentListQuery();

  const { employeeStore } = useStores() as { employeeStore: EmployeeStoreType };
  const { setRefetchEmployeeList } = employeeStore;
  const depOptions =
    departmentList?.data?.map(dep => ({
      value: dep._id,
      label: dep.departmentName,
    })) || [];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddEmployeeFormData>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      companyEmail: '',
      contactNo: '',
      basicSalary: '0',
      Joining_Date: new Date(),
      Designation: '',
      dep_ID: [],
    },
  });

  const handleDepChange = (newSelectedIds: string[]) => {
    setValue('dep_ID', newSelectedIds);
  };
  useEffect(() => {
    if (editData) {
      reset({
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        companyEmail: editData.companyEmail,
        contactNo: editData.contactNo,
        basicSalary: editData.basicSalary.toString(),
        Joining_Date: new Date(editData?.Joining_Date || ''),
        Designation: editData.Designation,
      });
    }
  }, [editData, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: editData ? updateTBAEmployeeData : addEmployeeData,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on adding employee!',
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
      setRefetchEmployeeList(true);
    },
  });

  const onSubmit = (data: AddEmployeeFormData) => {
    editData ? mutate({ data, id: editData?._id }) : mutate({ data, id: '' });
  };
  const showDep = watch('dep_ID', []);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[905px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Employee' : 'Add Employee'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 py-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="firstName" className="mb-2 text-left">
                First Name <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="firstName" placeholder="First Name" />
                )}
              />
              {errors.firstName && (
                <span className="text-sm text-red-500">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="lastName" className="mb-2 text-left">
                Last Name <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="lastName" placeholder="Last Name" />
                )}
              />
              {errors.lastName && (
                <span className="text-sm text-red-500">
                  {errors.lastName.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="email" className="mb-2 text-left">
                Personal Email <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    placeholder="personal@mail.com"
                    type="email"
                  />
                )}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="companyEmail" className="mb-2 text-left">
                Company Email <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="companyEmail"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="companyEmail"
                    placeholder="company@mail.com"
                    type="email"
                  />
                )}
              />
              {errors.companyEmail && (
                <span className="text-sm text-red-500">
                  {errors.companyEmail.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="contactNo" className="mb-2 text-left">
                Contact <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="contactNo"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="contactNo"
                    placeholder="03XXXXXXXXX"
                    type="tel"
                  />
                )}
              />
              {errors.contactNo && (
                <span className="text-sm text-red-500">
                  {errors.contactNo.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="basicSalary" className="mb-2 text-left">
                Basic Salary
              </Label>
              <Controller
                name="basicSalary"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="basicSalary"
                    placeholder="10000"
                    type="number"
                  />
                )}
              />
              {errors.basicSalary && (
                <span className="text-sm text-red-500">
                  {errors.basicSalary.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col">
              <Label htmlFor="Joining_Date" className="mb-2 text-left">
                Joining Date
              </Label>
              <Controller
                name="Joining_Date"
                control={control}
                render={({ field }) => (
                  <CustomDayPicker
                    initialDate={field.value}
                    onDateChange={field.onChange}
                    className="h-auto"
                  />
                )}
              />
              {errors.Joining_Date && (
                <span className="text-sm text-red-500">
                  {errors.Joining_Date.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="Designation" className="mb-2 text-left">
                Designation <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="Designation"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="No Designation" disabled>
                          Select designation
                        </SelectItem>
                        {types?.designationType.map((designation, index) => (
                          <SelectItem
                            key={index}
                            value={designation}
                            className="capitalize"
                          >
                            {designation}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                  </Select>
                )}
              />
              {errors.Designation && (
                <span className="text-sm text-red-500">
                  {errors.Designation.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <div className="mb-1 flex justify-between">
                <Label htmlFor="dep_ID" className="mb-2 text-left">
                  Select Departments<span className="text-red-600">*</span>
                </Label>
                {showDep.length > 0 && (
                  <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                    {showDep.length || 0}
                  </span>
                )}
              </div>
              <Controller
                name="dep_ID"
                control={control}
                render={({ field }) => {
                  const selectedNames = depOptions
                    .filter(option => field.value?.includes(option.value))
                    .map(option => option.label);

                  const labelText =
                    selectedNames.length > 0
                      ? selectedNames.join(', ')
                      : 'Select Departments';

                  return (
                    <MultiSelect
                      type={'Departments'}
                      label={labelText}
                      options={depOptions}
                      selectedValues={field.value || []}
                      onChange={(selectedValues: string[]) =>
                        handleDepChange(selectedValues)
                      }
                    />
                  );
                }}
              />
              {errors.dep_ID && (
                <span className="text-sm text-red-500">
                  {errors.dep_ID.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading || isPending}>
              {editData ? 'Edit Employee' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
