'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { EmployeeType } from '@/libs/validations/edit-employee';
import { updateEmployeeProfile } from '@/services/hr/edit-employee.service';
import { EditEmployeeStoreType } from '@/stores/hr/edit-employee';

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
});

export type PersonalSchemaFormData = z.infer<typeof personalSchema>;

const Profile = ({ empId, data }: PersonalProps) => {
  const router = useRouter();
  const { editEmployeeStore } = useStores() as {
    editEmployeeStore: EditEmployeeStoreType;
  };
  const { setRefetchEditEmployeeData } = editEmployeeStore;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalSchemaFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      Avatar: null,
      availability: data?.Current_Status || 'Available',
      profileDescription: data?.profileDescription || '',
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        Avatar: null,
        availability: data.Current_Status || 'Available',
        profileDescription: data.profileDescription || '',
      });
    }
  }, [data, reset]);

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

  const onSubmit = (newData: PersonalSchemaFormData) => {
    const formData = new FormData();
    formData.append('Avatar', newData.Avatar || '');
    formData.append('availability', newData.availability);
    formData.append('profileDescription', newData.profileDescription || '');
    updateEmployeeProfileData({
      id: empId || '',
      body: formData,
    });
    router.push('/hr/manage-employees');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-4">
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex w-full flex-col gap-x-8 gap-y-4 md:flex-row">
          <div className="flex flex-col gap-4 md:w-[90%]">
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
              <Label htmlFor="profileDescription" className="mb-2 text-left">
                Profile Description
                <span className="text-destructive/90">*</span>
              </Label>
              <Controller
                name="profileDescription"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="profileDescription"
                    placeholder="Write a short description about yourself"
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
          </div>
          <div className="flex min-w-[200px] flex-col">
            <Label htmlFor="availability" className="mb-2 text-left">
              Status After Logging In{' '}
              <span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="availability"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  defaultValue={field.value}
                  onChange={field.onChange}
                >
                  <div className="flex flex-row gap-2 text-nowrap">
                    <RadioGroupItem value="Available" id="r1" />
                    <Label htmlFor="r1">Available</Label>
                  </div>
                  <div className="flex flex-row gap-2 text-nowrap">
                    <RadioGroupItem value="Inactive" id="r2" />
                    <Label htmlFor="r2">Inactive</Label>
                  </div>
                  <div className="flex flex-row gap-2 text-nowrap">
                    <RadioGroupItem value="Busy" id="r3" />
                    <Label htmlFor="r3">Busy</Label>
                  </div>
                  <div className="flex flex-row gap-2 text-nowrap">
                    <RadioGroupItem value="Offline" id="r4" />
                    <Label htmlFor="r4">Offline</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.availability && (
              <span className="text-sm text-red-500">
                {errors.availability.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isUpdatingProfile}>
          Submit
        </Button>
      </DialogFooter>
    </form>
  );
};

export default Profile;
