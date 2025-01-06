'use client';

import React from 'react';

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
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { AnnouncementType } from '@/libs/validations/hr-announcements';
import {
  addAnnouncement,
  updateAnnouncement,
} from '@/services/hr/manage-announcements.service';
import { AuthStoreType } from '@/stores/auth';
import { AnnouncementsStoreType } from '@/stores/hr/announcements';

import { MessageErrorResponse } from '@/types';

const addAnnouncementSchema = z
  .object({
    StartDate: z.date(),
    EndDate: z.date(),
    Priority: z.string().min(1, 'Priority is required'),
    isEnabled: z.boolean().refine(value => value === true || value === false, {
      message: 'Status is required',
    }),
    title: z
      .string()
      .min(1, 'Invalid Announcement Title')
      .regex(/[a-zA-Z]/, 'Announcement title cannot be just a number'),
    Description: z.string().min(1, 'Description is required'),
    hrId: z.string().optional(),
  })
  .refine(data => data.StartDate <= data.EndDate, {
    message: 'End date should be greater or equal to start date',
  });

export type AddAnnouncementFormData = z.infer<typeof addAnnouncementSchema>;

interface AnnouncementDialogProps {
  data?: AnnouncementType;
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
}
const today = new Date();
today.setHours(0, 0, 0, 0);

export function AnnouncementDialog({
  data,
  open,
  onOpenChange,
  onCloseChange,
}: AnnouncementDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddAnnouncementFormData>({
    resolver: zodResolver(addAnnouncementSchema),
    defaultValues: {
      StartDate: data ? new Date(data.StartDate) : today,
      EndDate: data ? new Date(data.EndDate) : today,
      Priority: data ? data.Priority : '',
      isEnabled: data ? data.isEnabled : false,
      title: data ? data.title : '',
      Description: data ? data.Description : '',
    },
  });
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const { manageAnnouncementsStore } = useStores() as {
    manageAnnouncementsStore: AnnouncementsStoreType;
  };
  const { setRefetchAnnouncements } = manageAnnouncementsStore;

  const { mutate: addAnnouncementData, isPending: isAdding } = useMutation({
    mutationFn: addAnnouncement,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on adding announcement!',
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
      setRefetchAnnouncements(true);
    },
  });

  const { mutate: editAnnouncementData, isPending: isUpdating } = useMutation({
    mutationFn: updateAnnouncement,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on updating announcement!',
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
      setRefetchAnnouncements(true);
    },
  });

  const onSubmit = (formData: AddAnnouncementFormData) => {
    if (data) {
      editAnnouncementData({ id: data._id, data: formData });
    } else {
      const payload = {
        ...formData,
        hrId: user ? user.id : '',
      };

      addAnnouncementData(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{data ? 'Edit' : 'Add'} Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 py-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <Label htmlFor="StartDate" className="mb-2 text-left">
                Start Date
              </Label>
              <Controller
                name="StartDate"
                control={control}
                render={({ field }) => (
                  <CustomDayPicker
                    initialDate={field.value}
                    onDateChange={field.onChange}
                    className="h-auto"
                    disabled={date =>
                      date < today || date < new Date('1900-01-01')
                    }
                  />
                )}
              />
              {errors.StartDate && (
                <span className="text-sm text-red-500">
                  {errors.StartDate.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="EndDate" className="mb-2 text-left">
                End Date
              </Label>
              <Controller
                name="EndDate"
                control={control}
                render={({ field }) => (
                  <CustomDayPicker
                    initialDate={field.value}
                    onDateChange={field.onChange}
                    className="h-auto"
                    disabled={date =>
                      date < today || date < new Date('1900-01-01')
                    }
                  />
                )}
              />
              {errors.EndDate && (
                <span className="text-sm text-red-500">
                  {errors.EndDate.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <Label htmlFor="Priority" className="mb-2 text-left">
                Priority
              </Label>
              <Controller
                name="Priority"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative z-50 w-full rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="No Priority" disabled>
                          Select Priority
                        </SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                    <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                  </Select>
                )}
              />
              {errors.Priority && (
                <span className="text-sm text-red-500">
                  {errors.Priority.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="isEnabled" className="mb-2 text-left">
                Status
              </Label>
              <Controller
                name="isEnabled"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={value => field.onChange(value === 'true')}
                    value={field.value ? 'true' : 'false'}
                  >
                    <SelectTrigger className="relative z-50 w-full rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="No status" disabled>
                          Select status
                        </SelectItem>
                        <SelectItem value="true">Enable</SelectItem>
                        <SelectItem value="false">Disable</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                    <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                  </Select>
                )}
              />
              {errors.isEnabled && (
                <span className="text-sm text-red-500">
                  {errors.isEnabled.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="title" className="mb-2 text-left">
                Title
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="title"
                    placeholder="Enter title"
                    type="text"
                  />
                )}
              />
              {errors.title && (
                <span className="text-sm text-red-500">
                  {errors.title.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div className="flex flex-1 flex-col">
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
            <DialogFooter>
              <Button type="submit" disabled={isAdding || isUpdating}>
                {data ? 'Update' : 'Add'} Announcement
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
