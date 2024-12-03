'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DialogFooter } from '@/components/ui/dialog';
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
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { EmployeeType } from '@/libs/validations/edit-employee';
import { updateEmployeeData } from '@/services/hr/edit-employee.service';
import { EditEmployeeStoreType } from '@/stores/hr/edit-employee';
import { cn } from '@/utils';

import { MessageErrorResponse } from '@/types';

interface PersonalProps {
  empId?: string;
  data?: EmployeeType;
}

const personalSchema = z.object({
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  companyEmail: z.string().email(),
  email: z.string().email(),
  contactNo: z
    .string()
    .regex(/^(03|\+923)/, 'Contact number must start with "03" or "+923"'),
  Emergency_Phone: z
    .string()
    .regex(/^(03|\+923)/, 'Contact number must start with "03" or "+923"'),
  Nationality: z.string().min(3).max(50).optional(),
  DOB: z.date(),
  Marital_Status: z.enum(['married', 'unmarried']).optional(),
  Blood_Group: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  Gender: z.enum(['male', 'female']).optional(),
  Joining_Date: z.date().optional(),
  Family_Name: z.string().optional(),
  Family_Relation: z.string().optional(),
  Family_PhoneNo: z
    .string()
    .regex(/^(03|\+923)/, 'Contact number must start with "03" or "+923"'),
  Family_Occupation: z.string().optional(),
});

export type PersonalSchemaFormData = z.infer<typeof personalSchema>;

const Personal = ({ empId, data }: PersonalProps) => {
  const { editEmployeeStore } = useStores() as {
    editEmployeeStore: EditEmployeeStoreType;
  };
  const { setRefetchEditEmployeeData } = editEmployeeStore;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    clearErrors,
  } = useForm<PersonalSchemaFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      companyEmail: data?.companyEmail || '',
      email: data?.email || '',
      contactNo: data?.contactNo || '',
      Emergency_Phone: data?.Emergency_Phone || '',
      Nationality: data?.Nationality || '',
      DOB: data?.DOB ? new Date(data.DOB) : new Date(),
      Marital_Status: data?.Marital_Status || 'unmarried',
      Blood_Group: data?.Blood_Group || 'A+',
      Gender: data?.Gender || 'male',
      Joining_Date: data?.Joining_Date
        ? new Date(data.Joining_Date)
        : new Date(),
      Family_Name: data?.Family_Name || '',
      Family_Relation: data?.Family_Relation || '',
      Family_PhoneNo: data?.Family_PhoneNo || '',
      Family_Occupation: data?.Family_Occupation || '',
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        companyEmail: data.companyEmail || '',
        email: data.email || '',
        contactNo: data.contactNo || '',
        Emergency_Phone: data.Emergency_Phone || '',
        Nationality: data.Nationality || '',
        DOB: data.DOB ? new Date(data.DOB) : new Date(),
        Marital_Status: data.Marital_Status || 'unmarried',
        Blood_Group: data.Blood_Group || 'A+',
        Gender: data.Gender || 'male',
        Joining_Date: data.Joining_Date
          ? new Date(data.Joining_Date)
          : new Date(),
        Family_Name: data.Family_Name || '',
        Family_Relation: data.Family_Relation || '',
        Family_PhoneNo: data.Family_PhoneNo || '',
        Family_Occupation: data.Family_Occupation || '',
      });
    }
  }, [data, reset]);

  const { mutate: updateEmployee, isPending: isUpdatingEmployee } = useMutation(
    {
      mutationFn: updateEmployeeData,
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description:
            err?.response?.data?.message || 'Error on deleting data!',
          variant: 'error',
        });
      },
      onSuccess: response => {
        toast({
          title: 'Success',
          description: response?.message || 'Data deleted successfully!',
          variant: 'success',
        });
        setRefetchEditEmployeeData(true);
      },
    },
  );

  const onSubmit = (newData: PersonalSchemaFormData) => {
    updateEmployee({
      id: empId || '',
      body: newData,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-4">
      <div className="mb-4 flex flex-col gap-4">
        <h2 className="text-sm font-bold">Personal Details</h2>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label htmlFor="firstName" className="mb-2 text-left">
              First Name<span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input {...field} id="firstName" placeholder="John" />
              )}
            />
            {errors.firstName && (
              <span className="text-sm text-red-500">
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="lastName" className="mb-2 text-left">
              Last Name<span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input {...field} id="lastName" placeholder="Doe" />
              )}
            />
            {errors.lastName && (
              <span className="text-sm text-red-500">
                {errors.lastName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="companyEmail" className="mb-2 text-left">
              Company Email<span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="companyEmail"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="companyEmail"
                  placeholder="user@example.com"
                />
              )}
            />
            {errors.companyEmail && (
              <span className="text-sm text-red-500">
                {errors.companyEmail.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="email" className="mb-2 text-left">
              Email<span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} id="email" placeholder="user@example.com" />
              )}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label htmlFor="contactNo" className="mb-2 text-left">
              Contact No<span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="contactNo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="contactNo"
                  placeholder="03XXXXXXXXX"
                  onBlur={() => {
                    const phone = watch('contactNo');
                    const strippedVal = phone.replace(/^(03|\+923)/, '');
                    if (phone && strippedVal.length !== 9) {
                      setError('contactNo', {
                        type: 'manual',
                        message:
                          'Phone number must have exactly 9 digits after 03 or +923',
                      });
                    } else {
                      clearErrors('contactNo');
                    }
                  }}
                />
              )}
            />
            {errors.contactNo && (
              <span className="text-sm text-red-500">
                {errors.contactNo.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Emergency_Phone" className="mb-2 text-left">
              Emergency Phone No
            </Label>
            <Controller
              name="Emergency_Phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="Emergency_Phone"
                  placeholder="03XXXXXXXXX"
                  onBlur={() => {
                    const phone = watch('Emergency_Phone');
                    const strippedVal = phone.replace(/^(03|\+923)/, '');
                    if (phone && strippedVal.length !== 9) {
                      setError('Emergency_Phone', {
                        type: 'manual',
                        message:
                          'Phone number must have exactly 9 digits after 03 or +923',
                      });
                    } else {
                      clearErrors('Emergency_Phone');
                    }
                  }}
                />
              )}
            />
            {errors.Emergency_Phone && (
              <span className="text-sm text-red-500">
                {errors.Emergency_Phone.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Nationality" className="mb-2 text-left">
              Nationality
            </Label>
            <Controller
              name="Nationality"
              control={control}
              render={({ field }) => (
                <Input {...field} id="Nationality" placeholder="Pakistani" />
              )}
            />
            {errors.Nationality && (
              <span className="text-sm text-red-500">
                {errors.Nationality.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="DOB" className="mb-2 text-left">
              Date of Birth
            </Label>
            <Controller
              name="DOB"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'justify-start text-left font-normal',
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
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      disabled={date =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.DOB && (
              <span className="text-sm text-red-500">{errors.DOB.message}</span>
            )}
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label htmlFor="Marital_Status" className="mb-2 text-left">
              Marital Status
            </Label>
            <Controller
              name="Marital_Status"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                    <SelectValue placeholder="Select Marital Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="text-sm">
                      <SelectItem value="married" disabled>
                        Married
                      </SelectItem>
                      <SelectItem value="unmarried">Unmarried</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.Marital_Status && (
              <span className="text-sm text-red-500">
                {errors.Marital_Status.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Blood_Group" className="mb-2 text-left">
              Blood Group
            </Label>
            <Controller
              name="Blood_Group"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="text-sm">
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.Blood_Group && (
              <span className="text-sm text-red-500">
                {errors.Blood_Group.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Gender" className="mb-2 text-left">
              Gender
            </Label>
            <Controller
              name="Gender"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="text-sm">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.Gender && (
              <span className="text-sm text-red-500">
                {errors.Gender.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
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
                        'justify-start text-left font-normal',
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
                      selected={field.value ?? undefined}
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
        </div>

        <Separator />

        <h2 className="text-sm font-bold">Family Details</h2>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label htmlFor="Family_Name" className="mb-2 text-left">
              Name
            </Label>
            <Controller
              name="Family_Name"
              control={control}
              render={({ field }) => (
                <Input {...field} id="Family_Name" placeholder="John" />
              )}
            />
            {errors.Family_Name && (
              <span className="text-sm text-red-500">
                {errors.Family_Name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Family_Relation" className="mb-2 text-left">
              Relation
            </Label>
            <Controller
              name="Family_Relation"
              control={control}
              render={({ field }) => (
                <Input {...field} id="Family_Relation" placeholder="Doe" />
              )}
            />
            {errors.Family_Relation && (
              <span className="text-sm text-red-500">
                {errors.Family_Relation.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Family_PhoneNo" className="mb-2 text-left">
              Phone No
            </Label>
            <Controller
              name="Family_PhoneNo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="Family_PhoneNo"
                  placeholder="03XXXXXXXXX"
                  onBlur={() => {
                    const phone = watch('Family_PhoneNo');
                    const strippedVal = phone.replace(/^(03|\+923)/, '');
                    if (phone && strippedVal.length !== 9) {
                      setError('Family_PhoneNo', {
                        type: 'manual',
                        message:
                          'Phone number must have exactly 9 digits after 03 or +923',
                      });
                    } else {
                      clearErrors('Family_PhoneNo');
                    }
                  }}
                />
              )}
            />
            {errors.Family_PhoneNo && (
              <span className="text-sm text-red-500">
                {errors.Family_PhoneNo.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Family_Occupation" className="mb-2 text-left">
              Occupation
            </Label>
            <Controller
              name="Family_Occupation"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="Family_Occupation"
                  placeholder="Salesman"
                />
              )}
            />
            {errors.Family_Occupation && (
              <span className="text-sm text-red-500">
                {errors.Family_Occupation.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isUpdatingEmployee}>
          Submit
        </Button>
      </DialogFooter>
    </form>
  );
};

export default Personal;
