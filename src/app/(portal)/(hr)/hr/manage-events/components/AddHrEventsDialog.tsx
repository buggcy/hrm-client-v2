'use client';

import React, { useEffect } from 'react';

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

import { addHrEventsData } from '@/services/hr/hrEvents.service';
import { AuthStoreType } from '@/stores/auth';
import { HrEventsStoreType } from '@/stores/hr/hrEvents';

import { MessageErrorResponse } from '@/types';

const addHrEventsSchema = z
  .object({
    EventTitle: z
      .string()
      .min(1, 'Invalid Event Title')
      .regex(/[a-zA-Z]/, 'Event title cannot be just a number'),
    Description: z.string().min(1, 'Description is required'),
    Start_Date: z.date(),
    End_Date: z.date(),
    EventType: z.string().min(1, 'Event Type is required'),
    status: z.string().min(1, 'Status is required'),
    hrId: z.string().optional(),
  })
  .refine(data => data.Start_Date <= data.End_Date, {
    message: 'End date should be greater or equal to start date',
  });

export type AddHrEventsFormData = z.infer<typeof addHrEventsSchema>;

interface DialogDemoProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
}
const today = new Date();
today.setHours(0, 0, 0, 0);

export function HrEventsDialogDemo({
  open,
  onOpenChange,
  onCloseChange,
}: DialogDemoProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddHrEventsFormData>({
    resolver: zodResolver(addHrEventsSchema),
    defaultValues: {
      EventTitle: '',
      Description: '',
      Start_Date: today,
      End_Date: today,
      EventType: '',
      status: '',
    },
  });

  const { hrEventsStore } = useStores() as {
    hrEventsStore: HrEventsStoreType;
  };
  const { setRefetchHrEventsList } = hrEventsStore;

  const { mutate, isPending } = useMutation({
    mutationFn: addHrEventsData,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on adding event!',
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
      setRefetchHrEventsList(true);
    },
  });
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const onSubmit = (data: AddHrEventsFormData) => {
    const payload = {
      ...data,
      hrId: user ? user.id : '',
    };

    mutate(payload);
  };

  useEffect(() => {
    if (open) {
      reset({
        EventTitle: '',
        Description: '',
        Start_Date: today,
        End_Date: today,
        EventType: '',
        status: '',
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-full max-h-[550px] max-sm:min-h-[700px] sm:max-w-[600px]">
        <DialogTitle className="text-center sm:text-left">
          Add Event
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 pt-4">
          <div className="flex w-full flex-row gap-8 max-sm:flex-col max-sm:gap-2">
            <div className="flex w-full flex-1 flex-col">
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
                    disabled={date =>
                      date < today || date < new Date('1900-01-01')
                    }
                  />
                )}
              />
              {errors.Start_Date && (
                <span className="text-sm text-red-500">
                  {errors.Start_Date.message}
                </span>
              )}
            </div>
            <div className="flex w-full flex-1 flex-col">
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
                    disabled={date =>
                      date < today || date < new Date('1900-01-01')
                    }
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

          <div className="flex flex-wrap gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="EventTitle" className="mb-2 text-left">
                Event title
              </Label>
              <Controller
                name="EventTitle"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="EventTitle"
                    placeholder="Enter title"
                    type="text"
                  />
                )}
              />
              {errors.EventTitle && (
                <span className="text-sm text-red-500">
                  {errors.EventTitle.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex w-full flex-row gap-8 max-sm:flex-col max-sm:gap-2">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="EventType" className="mb-2 text-left">
                Event Type
              </Label>
              <Controller
                name="EventType"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative z-50 w-full rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="No EventType" disabled>
                          Select Event Type
                        </SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                        <SelectItem value="company">Non Holiday</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                    <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                  </Select>
                )}
              />
              {errors.EventType && (
                <span className="text-sm text-red-500">
                  {errors.EventType.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="status" className="mb-2 text-left">
                Status
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
              {errors.status && (
                <span className="text-sm text-red-500">
                  {errors.status.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 max-sm:gap-2">
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
              <Button type="submit" disabled={isPending}>
                Add Event
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
