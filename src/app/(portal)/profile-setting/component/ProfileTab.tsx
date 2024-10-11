'use client';
import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioInput } from '@/components/ui/radio';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

import { useReadEmployeeRecordQuery } from '@/hooks/employee/useEmployeeList.hook';
import { useTypesQuery } from '@/hooks/types.hook';
import { EditProfile } from '@/services/hr/employee.service';
import { useAuthStore } from '@/stores/auth';
import { validateFile } from '@/utils/fileValidation.utils';

import { MessageErrorResponse } from '@/types';
import { User } from '@/types/user.types';
interface UserProps {
  user: User;
}
const FormSchema = z.object({
  personalEmail: z.string().email('Invalid email address'),
  contactNo: z.string().regex(/^03\d{9}$/, 'Invalid contact number'),
  file: z.string().optional(),
  availability: z.string(),
  profileDescription: z.string(),
});

export type EditPasswordFormData = z.infer<typeof FormSchema>;

const ProfileTab: React.FC<UserProps> = ({ user }) => {
  const userId: string | undefined = user?.id;

  const { data } = useReadEmployeeRecordQuery(userId, {
    enabled: !!userId,
  });

  const { isLoading } = useTypesQuery();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditPasswordFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file: '',
      personalEmail: '',
      contactNo: '',
      availability: '',
      profileDescription: '',
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        personalEmail: data.output.employee.email,
        contactNo: data.output.employee.contactNo,
        availability: data.output.employee.Current_Status,
        profileDescription: data.output.employee.profileDescription,
      });
    }
  }, [data, reset]);

  const { setUser } = useAuthStore();
  const { mutate, isPending } = useMutation({
    mutationFn: EditProfile,
    onSuccess: response => {
      const token = response?.token;
      if (token) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setUser(token);
      }
      toast({
        title: 'Success',
        description: response?.message || 'Profile Edit Successfully!',
      });
      reset();
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on Edit Profile!',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: EditPasswordFormData) => {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    const fileError = validateFile(file);
    if (fileError) {
      toast({
        title: 'File Error',
        description: fileError,
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('personalEmail', data.personalEmail);
    formData.append('contactNo', data.contactNo);
    formData.append('availability', data.availability);
    formData.append('profileDescription', data.profileDescription);

    if (file) {
      formData.append('Avatar', file);
    }
    const payload = {
      id: user.id,
      formData,
    };
    mutate(payload);
  };

  return (
    <>
      <div className="mb-2 mt-4 text-base font-normal dark:text-white">
        Profile Edit
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 mt-4 text-xs text-gray-600 dark:text-gray-300">
          Required
        </div>
        <div className="mb-4 grid grid-cols-12 gap-4 text-sm">
          <Label
            htmlFor="file"
            className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
          >
            Upload Your Avatar
          </Label>
          <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <Input
                  type={'file'}
                  id="file"
                  placeholder="Browse for a file to upload..."
                  {...field}
                />
              )}
            />{' '}
            <span className="text-xs text-gray-500">
              {
                ' JPG, GIF, PNG, MOV and AVI. Please choose a files under 2GB to upload. File sizes are 400 x 300px.'
              }
            </span>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-12 gap-4">
          <Label
            htmlFor="personalEmail"
            className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
          >
            Personal Email
          </Label>
          <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
            <Controller
              name="personalEmail"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="personalEmail"
                  placeholder="personal@mail.com"
                  type="email"
                />
              )}
            />
          </div>
        </div>
        {errors.personalEmail && (
          <span className="text-sm text-red-500">
            {errors.personalEmail.message}
          </span>
        )}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <Label
            htmlFor="contactNo"
            className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
          >
            Contact No.
          </Label>
          <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
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
          </div>
        </div>
        {errors.contactNo && (
          <span className="text-sm text-red-500">
            {errors.contactNo.message}
          </span>
        )}
        <div className="mb-2 mt-4 text-xs text-gray-600 dark:text-gray-300">
          Availibility
        </div>
        <div className="mb-4 grid grid-cols-12 gap-4">
          <Label
            htmlFor="availability"
            className="col-span-12 text-right md:col-span-4 lg:col-span-4"
          >
            After Logging
          </Label>

          <div className="relative col-span-12 flex flex-col space-y-2 md:col-span-8 lg:col-span-8">
            <Controller
              name="availability"
              control={control}
              render={({ field }) => (
                <>
                  <RadioInput
                    id="available"
                    label="Available"
                    value="Available"
                    checked={field.value === 'Available'}
                    onChange={event => {
                      const value = event.target.value;
                      field.onChange(value);
                    }}
                  />
                  <RadioInput
                    id="inactive"
                    label="Inactive"
                    value="Inactive"
                    checked={field.value === 'Inactive'}
                    onChange={event => {
                      const value = event.target.value;
                      field.onChange(value);
                    }}
                  />
                  <RadioInput
                    id="busy"
                    label="Busy"
                    value="Busy"
                    checked={field.value === 'Busy'}
                    onChange={event => {
                      const value = event.target.value;
                      field.onChange(value);
                    }}
                  />
                  <RadioInput
                    id="offline"
                    label="Offline"
                    value="Offline"
                    checked={field.value === 'Offline'}
                    onChange={event => {
                      const value = event.target.value;
                      field.onChange(value);
                    }}
                  />
                </>
              )}
            />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-12 gap-4">
          <Label
            htmlFor="profileDescription"
            className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
          >
            Profile Description
          </Label>
          <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
            <Controller
              name="profileDescription"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="profileDescription"
                  placeholder="Enter Profile Description...."
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button size={'sm'} type="submit" disabled={isLoading || isPending}>
            Update Profile {isPending && '...'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileTab;
