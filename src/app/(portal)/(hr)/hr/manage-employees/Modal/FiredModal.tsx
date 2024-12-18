'use client';
import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { FireEmployee } from '@/services/hr/employee.service';
import { AuthStoreType } from '@/stores/auth';
import { cn } from '@/utils';

import { MessageErrorResponse } from '@/types';

interface ModalProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  fireId: string;
  setRefetchEmployeeList: (refetch: boolean) => void;
  userDesignation?: string;
}
const FormSchema = z.object({
  title: z.string().min(1, 'Fire Title is required'),
  reason: z.string().min(1, 'Fire Reason is required'),
  description: z.string().min(1, 'Fire Description is required'),
  appliedDate: z.date().refine(date => date != null, {
    message: 'Date is required',
  }),
  immedaiteDate: z.date().refine(date => date != null, {
    message: 'Immediate Date is required',
  }),
});

export type FormData = z.infer<typeof FormSchema>;

export function FiredModal({
  open,
  onCloseChange,
  fireId,
  setRefetchEmployeeList,
  userDesignation,
}: ModalProps) {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const userId = user?.id || '';
  const [isImmediate, setIsImmediate] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      reason: '',
      description: '',
      appliedDate: new Date(),
      immedaiteDate: new Date(),
    },
  });

  useEffect(() => {
    if (!open) {
      reset({
        title: '',
        reason: '',
        description: '',
        appliedDate: new Date(),
        immedaiteDate: new Date(),
      });
      setIsImmediate(false);
    }
  }, [open, reset]);

  const appliedDate = watch('appliedDate', new Date());

  useEffect(() => {
    if (open && !isImmediate) {
      if (userDesignation === 'Intern' || userDesignation === 'Probational') {
        const oneWeek = addDays(appliedDate, 7);
        setValue('immedaiteDate', oneWeek);
      } else {
        const oneMonthLater = addDays(appliedDate, 30);
        setValue('immedaiteDate', oneMonthLater);
      }
    }
  }, [open, appliedDate, setValue, isImmediate, userDesignation]);

  const handleCheckboxChange = (checked: boolean) => {
    setIsImmediate(checked);
    if (checked) {
      reset({
        ...getValues(),
        immedaiteDate: getValues().appliedDate,
      });
    } else {
      reset({
        ...getValues(),
        immedaiteDate: addDays(new Date(getValues().appliedDate), 30),
      });
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: FireEmployee,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Employee Fired!',
        variant: 'success',
      });
      reset();
      setRefetchEmployeeList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on firing employee!',
        variant: 'error',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const body = {
      employeeId: fireId,
      hrId: userId,
      title: data?.title,
      reason: data?.reason,
      description: data?.description,
      appliedDate: format(data.appliedDate, 'yyyy-MM-dd'),
      isFired: true,
      ...(isImmediate
        ? {
            type: 'immediate',
            immedaiteDate: format(data.immedaiteDate, 'yyyy-MM-dd'),
          }
        : { appliedDate: format(data.appliedDate, 'yyyy-MM-dd') }),
    };
    mutate({ body });
  };

  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{'Fire Employee'}</DialogTitle>
        </DialogHeader>

        <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="title" className="mb-2 text-left">
                Title <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="title"
                    placeholder="Please Enter Title"
                    {...field}
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
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="reason" className="mb-2 text-left">
                Reason <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="reason"
                    placeholder="Please Enter Reason"
                    {...field}
                  />
                )}
              />
              {errors.reason && (
                <span className="text-sm text-red-500">
                  {errors.reason.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="appliedDate" className="mb-2 text-left">
                Applied Date <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="appliedDate"
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
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={date => {
                          field.onChange(date);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.appliedDate && (
                <span className="text-sm text-red-500">
                  {errors.appliedDate.message}
                </span>
              )}
            </div>
            <div className="m-1 flex flex-row gap-2">
              <Checkbox
                checked={isImmediate}
                aria-label="Immediate Termination"
                className="translate-y-[2px]"
                onCheckedChange={checked => {
                  const isChecked = Boolean(checked);
                  handleCheckboxChange(isChecked);
                }}
              />
              <Label className="mt-1 text-xs">Immediate</Label>
            </div>
          </div>

          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="immedaiteDate" className="mb-2 text-left">
                Immediate Date <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="immedaiteDate"
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
                        disabled={true}
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
                        selected={field.value ?? undefined}
                        onSelect={date => {
                          field.onChange(date);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.immedaiteDate && (
                <span className="text-sm text-red-500">
                  {errors.immedaiteDate.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Description" className="mb-2 text-left">
              Description <span className="text-red-600">*</span>
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="Description"
                  placeholder="Write a description..."
                  onChange={e => field.onChange(e.target.value)}
                />
              )}
            />
            {errors.description && (
              <span className="text-sm text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending} size={'sm'}>
              Apply
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
