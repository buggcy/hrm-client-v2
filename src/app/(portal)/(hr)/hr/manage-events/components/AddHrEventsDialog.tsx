'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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

import { addHrEventsData } from '@/services/hr/hrEvents.service';
import { AuthStoreType } from '@/stores/auth';
import { HrEventsStoreType } from '@/stores/hr/hrEvents';
import { cn } from '@/utils';

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
      <DialogContent className="h-full max-h-[550px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 py-0">
          <div className="flex flex-row gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="Start_Date" className="mb-2 text-left">
                Start Date
              </Label>
              <Controller
                name="Start_Date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[263.664px] justify-start text-left font-normal',
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date =>
                          date < today || date < new Date('1900-01-01')
                        }
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.Start_Date && (
                <span className="text-sm text-red-500">
                  {errors.Start_Date.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="End_Date" className="mb-2 text-left">
                End Date
              </Label>
              <Controller
                name="End_Date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[263.664px] justify-start text-left font-normal',
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date =>
                          date < today || date < new Date('1900-01-01')
                        }
                      />
                    </PopoverContent>
                  </Popover>
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
          <div className="flex flex-wrap gap-8">
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
                    <SelectTrigger className="relative z-50 w-[263.664px] rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select EventType" />
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
                    <SelectTrigger className="relative z-50 w-[263.664px] rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="No status" disabled>
                          Select status
                        </SelectItem>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
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
          <div className="flex flex-col gap-14">
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
