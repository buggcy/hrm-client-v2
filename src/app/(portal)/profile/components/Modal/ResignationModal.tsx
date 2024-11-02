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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { ApplyResignation } from '@/services/employee/dashboard.service';
import { AuthStoreType } from '@/stores/auth';
import { cn } from '@/utils';

import { MessageErrorResponse } from '@/types';

interface ModalProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  refetch: () => void;
}
const FormSchema = z.object({
  title: z.string().min(1, 'Resignation Title is required'),
  reason: z.string().min(1, 'Resignation Reason is required'),
  description: z.string().min(1, 'Resignation Description is required'),
  appliedDate: z.date().refine(date => date != null, {
    message: 'Applied Date is required',
  }),
  immedaiteDate: z.date().refine(date => date != null, {
    message: 'Immediate Date is required',
  }),
});

export type FormData = z.infer<typeof FormSchema>;

export function ResignationModal({ open, onCloseChange, refetch }: ModalProps) {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const userId = user?.id || '';
  const [isImmediate, setIsImmediate] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
    watch,
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

  const appliedDate = watch('appliedDate', new Date());
  useEffect(() => {
    if (open && !isImmediate) {
      if (user?.Designation === 'Intern') {
        const oneWeek = addDays(appliedDate, 7);
        setValue('immedaiteDate', oneWeek);
      } else {
        const oneMonthLater = addDays(appliedDate, 30);
        setValue('immedaiteDate', oneMonthLater);
      }
    }
  }, [open, appliedDate, setValue, isImmediate, user?.Designation]);

  const handleCheckboxChange = (checked: boolean) => {
    setIsImmediate(checked);
    const today = new Date();
    if (checked) {
      reset({
        ...getValues(),
        appliedDate: today,
        immedaiteDate: today,
      });
    } else {
      reset({
        ...getValues(),
        appliedDate: today,
        immedaiteDate: today,
      });
    }
  };

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

  const { mutate, isPending } = useMutation({
    mutationFn: ApplyResignation,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Resignation Applied Successfully!',
        variant: 'success',
      });
      reset();
      refetch();
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on resigning the employee!',
        variant: 'error',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const body = {
      employeeId: userId,
      title: data?.title,
      reason: data?.reason,
      description: data?.description,
      appliedDate: format(data.appliedDate, 'yyyy-MM-dd'),
      isResigned: true,
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
          <DialogTitle>{'Apply Resignation'}</DialogTitle>
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
                        disabled={isImmediate}
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Checkbox
                      checked={isImmediate}
                      aria-label="Immediate Termination"
                      className="translate-y-[2px]"
                      onCheckedChange={checked => {
                        const isChecked = Boolean(checked);
                        handleCheckboxChange(isChecked);
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <ul className="list-disc pl-5">
                      <li>
                        If you want to resign immediately, you will not receive
                        your current month&apos;s salary.
                      </li>
                      <li>
                        If you choose to resign immediately, your account
                        credentials will be removed instantly.
                      </li>
                      <li>
                        This option is for immediate termination requests.
                      </li>
                      <li>Please ensure you understand the implications.</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Label className="mt-1 text-xs">Immediate</Label>
            </div>
          </div>

          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="immedaiteDate" className="mb-2 text-left">
                Expected Resignation Date{' '}
                <span className="text-red-600">*</span>
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
            <Button
              variant="ghostSecondary"
              type="button"
              onClick={() => onCloseChange(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
