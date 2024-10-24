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
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { EmployeeType } from '@/libs/validations/edit-employee';
import {
  updateEmployeeData,
  updateEmployeeProfile,
} from '@/services/hr/edit-employee.service';
import { EditEmployeeStoreType } from '@/stores/hr/edit-employee';
import { cn } from '@/utils';

import { MessageErrorResponse } from '@/types';

interface PersonalProps {
  empId?: string;
  data?: EmployeeType;
}

const personalSchema = z.object({
  Avatar: z
    .instanceof(File)
    .nullable()
    .refine(file => file === null || file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    }),
  availability: z.string(),
  profileDescription: z.string().optional(),
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  companyEmail: z.string().email(),
  email: z.string().email(),
  contactNo: z.string().min(11).max(13),
  Emergency_Phone: z.string().min(11).max(13).optional(),
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
  Family_PhoneNo: z.string().min(11).max(13).optional(),
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
  } = useForm<PersonalSchemaFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      Avatar: null,
      availability: data?.Current_Status || 'Available',
      profileDescription: data?.profileDescription || '',
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
  const { mutate: updateEmployeeProfileData, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: updateEmployeeProfile,
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description: err?.response?.data?.message || 'Error on adding data!',
          variant: 'error',
        });
      },
      onSuccess: response => {
        toast({
          title: 'Success',
          description: response?.message || 'Data added successfully!',
          variant: 'success',
        });
        setRefetchEditEmployeeData(true);
      },
    });

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
    const formData = new FormData();
    formData.append('Avatar', newData.Avatar || '');
    formData.append('availability', newData.availability);
    formData.append('profileDescription', newData.profileDescription || '');
    updateEmployeeProfileData({
      id: empId || '',
      body: formData,
    });
    updateEmployee({
      id: empId || '',
      body: newData,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-4">
      <div className="mb-4 flex flex-col gap-8">
        <div className="flex flex-col">
          <Label htmlFor="Avatar" className="mb-2 text-left">
            Choose Avatar
          </Label>
          <Controller
            name="Avatar"
            control={control}
            render={({ field }) => (
              <Input
                id="Avatar"
                placeholder="Choose a file"
                type="file"
                onChange={e => {
                  const file = e.target.files?.[0];
                  field.onChange(file);
                }}
              />
            )}
          />
          {errors.Avatar && (
            <span className="text-sm text-red-500">
              {errors.Avatar.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="availability" className="mb-2 text-left">
            Status After Logging In{' '}
            <span className="text-destructive/90">*</span>
          </Label>
          <Controller
            name="availability"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                <RadioGroupItem value="Available">Available</RadioGroupItem>
                <RadioGroupItem value="Inactive">Inactive</RadioGroupItem>
                <RadioGroupItem value="Busy">Busy</RadioGroupItem>
                <RadioGroupItem value="Offline">Offline</RadioGroupItem>
              </RadioGroup>
            )}
          />
          {errors.availability && (
            <span className="text-sm text-red-500">
              {errors.availability.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="profileDescription" className="mb-2 text-left">
            Profile Description<span className="text-destructive/90">*</span>
          </Label>
          <Controller
            name="profileDescription"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                id="profileDescription"
                placeholder="John Doe"
                onChange={e => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.profileDescription && (
            <span className="text-sm text-red-500">
              {errors.profileDescription.message}
            </span>
          )}
        </div>

        <Separator />

        <h2>Personal Details</h2>

        <div className="flex flex-col">
          <Label htmlFor="firstName" className="mb-2 text-left">
            First Name<span className="text-destructive/90">*</span>
          </Label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input {...field} id="firstName" placeholder="John Doe" />
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
              <Input {...field} id="lastName" placeholder="John Doe" />
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
              <Input {...field} id="companyEmail" placeholder="John Doe" />
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
              <Input {...field} id="email" placeholder="John Doe" />
            )}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <Label htmlFor="contactNo" className="mb-2 text-left">
            Contact No<span className="text-destructive/90">*</span>
          </Label>
          <Controller
            name="contactNo"
            control={control}
            render={({ field }) => (
              <Input {...field} id="contactNo" placeholder="John Doe" />
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
            Emergency Phone No<span className="text-destructive/90">*</span>
          </Label>
          <Controller
            name="Emergency_Phone"
            control={control}
            render={({ field }) => (
              <Input {...field} id="Emergency_Phone" placeholder="John Doe" />
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
            Nationality<span className="text-destructive/90">*</span>
          </Label>
          <Controller
            name="Nationality"
            control={control}
            render={({ field }) => (
              <Input {...field} id="Nationality" placeholder="John Doe" />
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

        <div className="flex flex-col">
          <Label htmlFor="Marital_Status" className="mb-2 text-left">
            Marital Status
          </Label>
          <Controller
            name="Marital_Status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="text-sm">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
                <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
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

        <Separator />

        <h2>Family Details</h2>

        <div className="flex flex-col">
          <Label htmlFor="Family_Name" className="mb-2 text-left">
            Name<span className="text-destructive/90">*</span>
          </Label>
          <Controller
            name="Family_Name"
            control={control}
            render={({ field }) => (
              <Input {...field} id="Family_Name" placeholder="John Doe" />
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
            Relation<span className="text-destructive/90">*</span>
          </Label>
          <Controller
            name="Family_Relation"
            control={control}
            render={({ field }) => (
              <Input {...field} id="Family_Relation" placeholder="John Doe" />
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
            Phone No<span className="text-destructive/90">*</span>
          </Label>
          <Controller
            name="Family_PhoneNo"
            control={control}
            render={({ field }) => (
              <Input {...field} id="Family_PhoneNo" placeholder="John Doe" />
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
            Occupation<span className="text-destructive/90">*</span>
          </Label>
          <Controller
            name="Family_Occupation"
            control={control}
            render={({ field }) => (
              <Input {...field} id="Family_Occupation" placeholder="John Doe" />
            )}
          />
          {errors.Family_Occupation && (
            <span className="text-sm text-red-500">
              {errors.Family_Occupation.message}
            </span>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          disabled={isUpdatingProfile || isUpdatingEmployee}
        >
          Submit
        </Button>
      </DialogFooter>
    </form>
  );
};

export default Personal;
