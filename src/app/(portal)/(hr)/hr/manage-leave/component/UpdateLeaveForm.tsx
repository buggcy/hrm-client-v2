import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  setRefetchManageLeaveList: (refetch: boolean) => void;
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
  setRefetchManageLeaveList,
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
        variant: 'success',
      });
      setRefetchManageLeaveList(true);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on updating the leaves!',
        variant: 'error',
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
        <div className="flex flex-row flex-wrap rounded-lg border bg-background">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="casual">
              <AccordionTrigger className="p-4">
                {'Casual Leave'}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                <div className="flex flex-col">
                  <Label htmlFor="casual" className="mb-2 text-left">
                    Allowed Leaves
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="sick">
              <AccordionTrigger className="p-4">
                {'Sick Leave'}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                <div className="flex flex-col">
                  <Label htmlFor="sick" className="mb-2 text-left">
                    Allowed Leaves
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="Annual">
              <AccordionTrigger className="p-4">
                {'Annual Leave'}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                <div className="flex flex-col">
                  <Label htmlFor="annual" className="mb-2 text-left">
                    Allowed Leaves
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mb-4 flex w-full px-4">
            <Button
              type="submit"
              disabled={isPending}
              className="mt-0 w-full md:mt-6 lg:mt-6"
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
