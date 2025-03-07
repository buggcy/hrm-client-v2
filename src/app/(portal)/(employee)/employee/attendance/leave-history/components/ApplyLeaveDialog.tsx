'use client';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ChevronDown, Eye } from 'lucide-react';
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
import FormattedTextArea from '@/components/ui/FormattedTextArea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { LeaveListType } from '@/libs/validations/hr-leave-list';
import {
  applyLeaveData,
  getLeaveData,
  updateLeaveRequest,
} from '@/services/employee/leave-history.service';
import { AuthStoreType } from '@/stores/auth';
import { LeaveHistoryStoreType } from '@/stores/employee/leave-history';

import distributeLeaves from './LeaveDistributionCalculator';

const applyLeaveSchema = z
  .object({
    User_ID: z.string(),
    Start_Date: z.date(),
    End_Date: z.date(),
    Status: z.string(),
    Title: z.string().min(1, 'Title is required'),
    Leave_Type: z.string().min(1, 'Leave Type is required'),
    Description: z.string().min(1, 'Description is required'),
    proofDocument: z
      .instanceof(File)
      .nullable()
      .refine(file => file === null || file.size <= 800 * 1024, {
        message: 'File size should be less than 800KB',
      }),
  })
  .refine(data => data.Start_Date <= data.End_Date, {
    message: 'End date must be greater than or equal to the start date',
    path: ['End_Date'],
  });

export type ApplyLeaveFormData = z.infer<typeof applyLeaveSchema>;

interface DialogDemoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseChange: (open: boolean) => void;
  data?: LeaveListType;
  id?: string;
}

export function ApplyLeaveDialog({
  open,
  onOpenChange,
  onCloseChange,
  data,
  id,
}: DialogDemoProps) {
  const { leaveHistoryStore } = useStores() as {
    leaveHistoryStore: LeaveHistoryStoreType;
  };
  const { setRefetchLeaveHistoryList } = leaveHistoryStore;
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const [leaveDistribution, setLeaveDistribution] = useState<
    { leaves: number; unpaidLeaves: number; annualLeaves?: number } | undefined
  >({
    leaves: 0,
    unpaidLeaves: 0,
    annualLeaves: 0,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ApplyLeaveFormData>({
    resolver: zodResolver(applyLeaveSchema),
    defaultValues: {
      User_ID: user?.id || '',
      Start_Date: data?.Start_Date ? new Date(data.Start_Date) : new Date(),
      End_Date: data?.End_Date ? new Date(data.End_Date) : new Date(),
      Status: 'Pending',
      Title: data?.Title || '',
      Leave_Type: data?.Leave_Type || '',
      Description: data?.Description || '',
      proofDocument: null,
    },
  });
  const startDate = watch('Start_Date');
  const endDate = watch('End_Date');
  const leaveType = watch('Leave_Type');

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);
  const { mutate: applyLeave, isPending: isApplying } = useMutation({
    mutationFn: applyLeaveData,
    onError: err => {
      toast({
        title: 'Error',
        description:
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Error on applying for leave!',
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
      onCloseChange(false);
      setRefetchLeaveHistoryList(true);
    },
  });

  const { mutate: updateLeave, isPending: isUpdating } = useMutation({
    mutationFn: updateLeaveRequest,
    onError: err => {
      toast({
        title: 'Error',
        description:
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Error on applying for leave!',
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
      onCloseChange(false);
      setRefetchLeaveHistoryList(true);
    },
  });

  const { mutate: fetchLeaveData, data: leaveData } = useMutation({
    mutationFn: ({ employeeId }: { employeeId: string }) =>
      getLeaveData({
        employeeId,
      }),
    onError: err => {
      toast({
        title: 'Error',
        description: err?.message || 'Error on fetching stats data!',
        variant: 'error',
      });
    },
  });

  useEffect(() => {
    if (user) {
      fetchLeaveData({
        employeeId: user?.id ? user.id : '',
      });
    }
  }, [user, fetchLeaveData]);

  useEffect(() => {
    if (startDate && endDate && leaveType && leaveData) {
      setLeaveDistribution(
        distributeLeaves(
          leaveType as 'Casual' | 'Sick' | 'Annual',
          startDate,
          endDate,
          leaveData,
          new Date(user?.Joining_Date || '') || new Date(),
        ),
      );
    }
  }, [startDate, endDate, leaveType, leaveData, user?.Joining_Date]);

  const onSubmit = (form: ApplyLeaveFormData) => {
    const startDateLocal = new Date(form.Start_Date);
    const endDateLocal = new Date(form.End_Date);

    const startDateUtcPlus5 = new Date(
      startDateLocal.getTime() + 5 * 60 * 60 * 1000,
    );
    const endDateUtcPlus5 = new Date(
      endDateLocal.getTime() + 5 * 60 * 60 * 1000,
    );
    const formData = new FormData();
    formData.append('User_ID', user?.id || '');
    formData.append('Start_Date', startDateUtcPlus5.toISOString());
    formData.append('End_Date', endDateUtcPlus5.toISOString());
    formData.append('Status', 'Pending');
    formData.append('Title', form.Title);
    formData.append('Leave_Type', form.Leave_Type);
    formData.append('Description', form.Description);
    if (form.proofDocument) {
      formData.append('proofDocument', form.proofDocument);
    }
    formData.append('paidLeaves', leaveDistribution?.leaves.toString() || '');
    formData.append(
      'unpaidLeaves',
      leaveDistribution?.unpaidLeaves.toString() || '',
    );
    if (
      leaveDistribution?.annualLeaves &&
      leaveDistribution?.annualLeaves > 0
    ) {
      formData.append(
        'annualLeaves',
        leaveDistribution?.annualLeaves.toString() || '',
      );
    }
    if (data) {
      updateLeave({
        id: id || '',
        body: formData,
      });
    } else {
      applyLeave(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle> {data ? 'Edit' : 'Apply For'} Leave</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 py-4">
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-row items-start justify-between gap-4">
              <div className="flex w-full flex-col">
                <Label htmlFor="Start_Date" className="mb-2 text-left">
                  Start Date
                </Label>
                <Controller
                  name="Start_Date"
                  control={control}
                  render={({ field }) => (
                    <CustomDayPicker
                      initialDate={field.value}
                      onDateChange={field.onChange}
                      className="h-auto"
                      disabled={date => date < new Date()}
                    />
                  )}
                />
                {errors.Start_Date && (
                  <span className="text-sm text-red-500">
                    {errors.Start_Date.message}
                  </span>
                )}
              </div>
              <div className="flex w-full flex-col">
                <Label htmlFor="End_Date" className="mb-2 text-left">
                  End Date
                </Label>
                <Controller
                  name="End_Date"
                  control={control}
                  render={({ field }) => (
                    <CustomDayPicker
                      initialDate={field.value}
                      onDateChange={field.onChange}
                      className="h-auto"
                      disabled={date => date < new Date()}
                    />
                  )}
                />
                {errors.End_Date && (
                  <span className="text-sm text-red-500">
                    {errors.End_Date.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="Leave_Type" className="mb-2 text-left">
                Leave Type
              </Label>
              <Controller
                name="Leave_Type"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative z-50 w-full rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select Leave Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="N" disabled>
                          Select Leave Type
                        </SelectItem>
                        <SelectItem value="Casual">Casual Leave</SelectItem>
                        <SelectItem value="Sick">Sick Leave</SelectItem>
                        <SelectItem value="Annual">Annual Leave</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                    <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                  </Select>
                )}
              />
              {errors.Leave_Type && (
                <span className="text-sm text-red-500">
                  {errors.Leave_Type.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="Title" className="mb-2 text-left">
                Title
              </Label>
              <Controller
                name="Title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="Title"
                    placeholder="Title"
                    className="w-full"
                  />
                )}
              />
              {errors.Title && (
                <span className="text-sm text-red-500">
                  {errors.Title.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="Description" className="mb-2 text-left">
                Description
              </Label>
              <Controller
                name="Description"
                control={control}
                render={({ field }) => (
                  <FormattedTextArea
                    value={field.value || ''}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.Description && (
                <span className="text-sm text-red-500">
                  {errors.Description.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="proofDocument" className="mb-2 text-left">
                Choose Document{' '}
                {data && data?.Proof_Document && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Eye
                            className="ml-2 inline cursor-pointer text-primary/80 hover:text-primary"
                            onClick={() =>
                              data?.Proof_Document &&
                              window.open(
                                String(data?.Proof_Document),
                                '_blank',
                              )
                            }
                            size={18}
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Click to Preview Document</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </Label>
              <Controller
                name="proofDocument"
                control={control}
                render={({ field }) => (
                  <Input
                    id="proofDocument"
                    placeholder="Choose a file"
                    type="file"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                )}
              />
              {errors.proofDocument && (
                <span className="text-sm text-red-500">
                  {errors.proofDocument.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isApplying || isUpdating}>
              {data ? 'Edit' : 'Apply For'} Leave
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
