'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { HrEventsListType } from '@/libs/validations/employee';
import { editHrEventsData } from '@/services/hr/hrEvents.service';
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
    Start_Date: z.string(),
    End_Date: z.string(),
    EventType: z.string().min(1, 'Event Type is required'),
    _id: z.string(),
    status: z.boolean().refine(value => value === true || value === false, {
      message: 'Status is required',
    }),
  })
  .refine(data => data.Start_Date <= data.End_Date, {
    message: 'End date should be greater or equal to start date',
  });

export type AddHrEventsFormData = z.infer<typeof addHrEventsSchema>;

interface DialogDemoProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
  data: HrEventsListType & { _id: string };
}

export function EditHrEventsDialogDemo({
  data,
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
      EventTitle: data.Event_Name,
      Description: data.Event_Discription,
      Start_Date: data.Event_Start,
      End_Date: data.Event_End,
      EventType: data.Event_Type,
      status: data.isEnabled,
      _id: data._id,
    },
  });

  const { hrEventsStore } = useStores() as {
    hrEventsStore: HrEventsStoreType;
  };
  const { setRefetchHrEventsList } = hrEventsStore;

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddHrEventsFormData }) =>
      editHrEventsData(id, data),
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on Editing event!',
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

  const onSubmit = (data: AddHrEventsFormData) => {
    const eventId = data._id;
    mutate({ id: eventId, data });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[550px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
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
                          format(new Date(field.value), 'MMM dd, yyyy')
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
                        onSelect={date =>
                          field.onChange(
                            date ? format(date, 'MMM dd, yyyy') : '',
                          )
                        }
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
                          format(new Date(field.value), 'MMM dd, yyyy')
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
                        onSelect={date =>
                          field.onChange(
                            date ? format(date, 'MMM dd, yyyy') : '',
                          )
                        }
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
                    onValueChange={value => field.onChange(value === 'true')}
                    value={field.value ? 'true' : 'false'}
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
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="Description" className="mb-2 text-left">
                Description
              </Label>
              <Controller
                name="Description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="Description"
                    rows={6}
                    placeholder="Enter your description"
                  />
                )}
              />
              {errors.Description && (
                <span className="text-sm text-red-500">
                  {errors.Description.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              Edit Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
