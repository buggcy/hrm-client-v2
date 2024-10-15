'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { useStores } from '@/providers/Store.Provider';

import {
  useAddAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from '@/hooks/hr/useManageAnnouncement';
import { AnnouncementType } from '@/libs/validations/hr-announcement';
import { AuthStoreType } from '@/stores/auth';
import { cn } from '@/utils';

import { MessageErrorResponse } from '@/types';

const addAnnouncementSchema = z.object({
  StartDate: z.string().min(1, 'Please Select Start Date'),
  EndDate: z.string().min(1, 'Please Select End Date'),
  Priority: z.string().min(1, 'Please Select Priority'),
  TargetAudience: z.string().min(1, 'Please Select Target Audience'),
  Description: z.string().min(1, 'Please Enter Description'),
  title: z.string().min(1, 'Please Enter Title'),
  hrId: z.string(),
  isEnabled: z.boolean().optional(),
});

export type AddAnnouncementFormData = z.infer<typeof addAnnouncementSchema>;

export interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
  mode: 'add' | 'edit';
  announcementData?: AnnouncementType | null;
}

export function AnnouncementDialog({
  open,
  onOpenChange,
  onCloseChange,
  mode,
  announcementData,
}: AnnouncementDialogProps) {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const addAnnouncementMutation = useAddAnnouncementMutation();
  const updateAnnouncementMutation = useUpdateAnnouncementMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddAnnouncementFormData>({
    resolver: zodResolver(addAnnouncementSchema),
    defaultValues: {
      StartDate: announcementData?.StartDate || '',
      EndDate: announcementData?.EndDate || '',
      Priority: announcementData?.Priority || '',
      TargetAudience: announcementData?.TargetAudience || 'AllEmployees',
      title: announcementData?.title || '',
      Description: announcementData?.Description || '',
      hrId: announcementData?.hrId || user?.id,
      isEnabled: announcementData?.isEnabled ?? true,
    },
  });

  const onSubmit = async (data: AddAnnouncementFormData) => {
    console.log('Submitting form with data:', data);
    try {
      if (mode === 'add') {
        await addAnnouncementMutation.mutateAsync(data);
      } else {
        if (!announcementData?._id) {
          throw new Error('Announcement ID is required for updating.');
        }
        await updateAnnouncementMutation.mutateAsync({
          id: announcementData._id,
          values: data,
        });
      }
      console.log('Announcement operation successful');
      toast({
        title: 'Success',
        description: `Announcement ${mode === 'add' ? 'added' : 'updated'} successfully.`,
      });
      reset();
      onCloseChange();
    } catch (err) {
      console.error('Error processing announcement:', err);
      const error = err as AxiosError<MessageErrorResponse>;
      toast({
        title: 'Error',
        description:
          error?.response?.data?.message ||
          `Error ${mode === 'add' ? 'adding' : 'updating'} announcement. Please try again.`,
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    if (open) {
      reset(announcementData || {});
    }
  }, [open, reset, announcementData]);
  const isSubmitting =
    addAnnouncementMutation.isPending || updateAnnouncementMutation.isPending;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add Announcement' : 'Update Announcement'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 py-4">
          {/* Start Date | End Date */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="StartDate" className="mb-2 text-left">
                Start Date
              </Label>
              <Controller
                name="StartDate"
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
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={date => {
                          if (date) {
                            field.onChange(format(date, 'yyyy-MM-dd'));
                          }
                        }}
                        disabled={date =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.StartDate && (
                <span className="text-sm text-red-500">
                  {errors.StartDate.message}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <Label htmlFor="EndDate" className="mb-2 text-left">
                End Date
              </Label>
              <Controller
                name="EndDate"
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
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={date => {
                          if (date) {
                            field.onChange(format(date, 'yyyy-MM-dd'));
                          }
                        }}
                        disabled={date =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.EndDate && (
                <span className="text-sm text-red-500">
                  {errors.EndDate.message}
                </span>
              )}
            </div>
          </div>

          {/* Priority | Status */}
          <div className="flex flex-col md:flex-row md:items-end">
            <div className="flex flex-1 flex-col md:w-1/2 md:pr-4">
              <Label className="mb-2" htmlFor="Priority">
                Select Priority
              </Label>
              <Controller
                name="Priority"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.Priority && (
                <p className="text-red-500">{errors.Priority.message}</p>
              )}
            </div>

            <div className="flex flex-1 flex-col md:w-1/2 md:pl-4">
              <Label className="mb-2" htmlFor="Status">
                Select Status
              </Label>
              <Controller
                name="isEnabled"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={value => field.onChange(value === 'true')}
                    defaultValue={field.value ? 'true' : 'false'}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="true">Enabled</SelectItem>
                        <SelectItem value="false">Disabled</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.Priority && (
                <p className="text-transparent">{errors.Priority.message}</p>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <Label className="mb-2" htmlFor="title">
              Announcement Title
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Please Enter Title"
                  {...field}
                  value={field.value || ''}
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <Label className="mb-2" htmlFor="Description">
              Description
            </Label>
            <Controller
              name="Description"
              control={control}
              render={({ field }) => (
                <Input placeholder="Please Enter Description" {...field} />
              )}
            />
            {errors.Description && (
              <p className="text-red-500">{errors.Description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Processing...'
                : mode === 'add'
                  ? 'Add'
                  : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
