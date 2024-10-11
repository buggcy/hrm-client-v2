import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

import { UpdateAllowedLeave } from '@/services/hr/manage.leave.service';

import { MessageErrorResponse } from '@/types';

interface UpdateLeaveProps {
  selectedEmployeeId: string;
  CasualLeaves?: number | string | undefined;
  SickLeaves?: number | string | undefined;
  AnnualLeaves?: number | string | undefined;
  refetch: () => void;
}

const FormSchema = z.object({
  Casual_Leaves: z.string().min(1, 'Casual Leave is required'),
  Sick_Leaves: z.string().min(1, 'Sick Leave is required'),
  Annual_Leaves: z.string().min(1, 'Annual Leave is required'),
});

export type LeaveFormData = z.infer<typeof FormSchema>;

const UpdateLeaveForm = ({
  selectedEmployeeId,
  CasualLeaves,
  AnnualLeaves,
  SickLeaves,
  refetch,
}: UpdateLeaveProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LeaveFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Casual_Leaves: CasualLeaves?.toString() || '0',
      Sick_Leaves: SickLeaves?.toString() || '0',
      Annual_Leaves: AnnualLeaves?.toString() || '0',
    },
  });
  useEffect(() => {
    setValue('Casual_Leaves', CasualLeaves?.toString() || '0');
    setValue('Sick_Leaves', SickLeaves?.toString() || '0');
    setValue('Annual_Leaves', AnnualLeaves?.toString() || '0');
  }, [CasualLeaves, SickLeaves, AnnualLeaves, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateAllowedLeave,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Leave Updated Successfully!',
      });
      refetch();
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on updating the leaves!',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: LeaveFormData) => {
    const body = {
      Casual_Leaves: Number(data?.Casual_Leaves),
      Sick_Leaves: Number(data?.Sick_Leaves),
      Annual_Leaves: Number(data?.Annual_Leaves),
    };
    const payload = {
      id: selectedEmployeeId,
      body,
    };
    mutate(payload);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="-mx-4 flex flex-wrap">
          <div className="mb-4 w-full px-4 md:w-3/12">
            <Label htmlFor="casual" className="mb-2 text-left">
              Casual Leave
            </Label>
            <Controller
              name="Casual_Leaves"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="casual"
                  placeholder="Enter Casual Leave"
                  {...field}
                />
              )}
            />
            {errors.Casual_Leaves && (
              <span className="text-sm text-red-500">
                {errors.Casual_Leaves.message}
              </span>
            )}
          </div>
          <div className="mb-4 w-full px-4 md:w-3/12">
            <Label htmlFor="sick" className="mb-2 text-left">
              Sick Leave
            </Label>
            <Controller
              name="Sick_Leaves"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="sick"
                  placeholder="Enter Sick Leave"
                  {...field}
                />
              )}
            />
            {errors.Sick_Leaves && (
              <span className="text-sm text-red-500">
                {errors.Sick_Leaves.message}
              </span>
            )}
          </div>
          <div className="mb-4 w-full px-4 md:w-3/12">
            <Label htmlFor="annual" className="mb-2 text-left">
              Annual Leave
            </Label>
            <Controller
              name="Annual_Leaves"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="annual"
                  placeholder="Enter Annual Leave"
                  {...field}
                />
              )}
            />
            {errors.Annual_Leaves && (
              <span className="text-sm text-red-500">
                {errors.Annual_Leaves.message}
              </span>
            )}
          </div>
          <div className="mb-4 flex w-full px-4 md:w-3/12">
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="mt-0 md:mt-6 lg:mt-6"
            >
              Update
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default UpdateLeaveForm;
