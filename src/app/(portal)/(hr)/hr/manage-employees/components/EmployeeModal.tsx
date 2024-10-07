'use client';

import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

import { useTypesQuery } from '@/hooks/types.hook';
import { addEmployeeData } from '@/services/hr/employee.service';
import { cn } from '@/utils';

import { MessageErrorResponse } from '@/types';

// Define the Zod schema
const addEmployeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  companyEmail: z.string().email('Invalid company email address'),
  contactNo: z.string().regex(/^03\d{9}$/, 'Invalid contact number'),
  basicSalary: z
    .string()
    .min(1, 'Salary is required')
    .regex(/^\d+$/, 'Salary must be a valid number'),
  Joining_Date: z.date(),
  Designation: z.string().min(1, 'Designation is required'),
});

export type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;

interface DialogDemoProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
}

export function DialogDemo({
  open,
  onOpenChange,
  onCloseChange,
}: DialogDemoProps) {
  const { data: types, isLoading } = useTypesQuery();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
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
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addEmployeeData,
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
    },
  });

  const onSubmit = (data: AddEmployeeFormData) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[470px] sm:max-w-[905px]">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 py-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="firstName" className="mb-2 text-left">
                First Name
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
                Last Name
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
                Personal Email
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
                Company Email
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
                Contact
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

          <div className="flex flex-wrap gap-8 sm:max-w-[570px]">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="Joining_Date" className="mb-2 text-left">
                Joining Date
              </Label>
              <Controller
                name="Joining_Date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[263.664px] justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.Joining_Date && (
                <span className="text-sm text-red-500">
                  {errors.Joining_Date.message}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <Label htmlFor="Designation" className="mb-2 text-left">
                Designation
              </Label>
              <Controller
                name="Designation"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative z-50 w-[263.664px] rounded-md border px-3 py-2 text-left text-sm">
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
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading || isPending}>
              Add Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
