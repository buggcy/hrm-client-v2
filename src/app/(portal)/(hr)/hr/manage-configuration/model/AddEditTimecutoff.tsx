import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { parse } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import TimePicker from '@/components/TimePicker';
import { Button } from '@/components/ui/button';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';

import { ConfigurationType } from '@/libs/validations/hr-configuration';
import {
  addTimeCutOffType,
  editTimecutoff,
} from '@/services/hr/hrConfiguration.service';

import { MessageErrorResponse } from '@/types';

interface DialogProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  type: string;
  userId: string;
  setRefetchConfigurationList: (refetch: boolean) => void;
  TypeToEdit: ConfigurationType | null;
}
const timeFormatRegex = /^(0[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;

const FormSchema = z
  .object({
    type: z.string().min(1, 'Time cut off is required'),
    inTime: z.string().min(8, 'Start Time is required'),
    outTime: z.string().min(8, 'End Time is required'),
  })
  .refine(data => timeFormatRegex.test(data.inTime), {
    path: ['inTime'],
    message: 'Start Time must be in the format HH:MM AM/PM',
  })
  .refine(data => timeFormatRegex.test(data.outTime), {
    path: ['outTime'],
    message: 'End Time must be in the format HH:MM AM/PM',
  });

export type TypeFormData = z.infer<typeof FormSchema>;

export function AddEditTimecutoff({
  open,
  onCloseChange,
  type,
  userId,
  setRefetchConfigurationList,
  TypeToEdit,
}: DialogProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
    watch,
  } = useForm<TypeFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: '',
      inTime:
        type === 'edit' && TypeToEdit?.startTime ? TypeToEdit.startTime : '',
      outTime:
        type === 'edit' && TypeToEdit?.endTime ? TypeToEdit.endTime ?? '' : '',
    },
  });

  useEffect(() => {
    if (type === 'edit' && TypeToEdit) {
      reset({
        type: TypeToEdit?.timeCutOff?.toString() || '',
        inTime: TypeToEdit?.startTime || '',
        outTime: TypeToEdit?.endTime || '',
      });
    }
  }, [TypeToEdit, type, reset]);

  const inTime = watch('inTime');
  const outTime = watch('outTime');
  const timecutoff = watch('type');

  useEffect(() => {
    if (inTime && outTime) {
      const start = parse(inTime, 'hh:mm a', new Date());
      const end = parse(outTime, 'hh:mm a', new Date());

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        setValue('type', diffInMinutes.toString());
      }
    }
  }, [inTime, outTime, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleMutation = useMutation({
    mutationFn: (data: {
      userId: string;
      timeCutOff: number;
      startTime: string;
      endTime: string;
      id?: string;
    }) => {
      if (type === 'edit' && !data.id) {
        throw new Error('ID is required for editing time cutoff');
      }
      return type === 'add'
        ? addTimeCutOffType(data)
        : editTimecutoff({ ...data, id: data.id as string });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description:
          response?.message ||
          `Time Cut Off ${type === 'add' ? 'Added' : 'Updated'} Successfully!`,
        variant: 'success',
      });
      reset();
      setRefetchConfigurationList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err.message ||
          `Error on ${type === 'add' ? 'adding' : 'updating'} time cut off!`,
        variant: 'error',
      });
    },
  });

  const { mutate: handleMutate, isPending: isMutating } = handleMutation;

  const onSubmit = (data: TypeFormData) => {
    const timeCutOffValue = Number(data?.type);

    if (isNaN(timeCutOffValue) || timeCutOffValue <= 0) {
      setError('type', {
        message: 'Time Cut Off must be a positive number',
      });
      return;
    }

    const payload = {
      ...(type === 'edit' && { id: TypeToEdit?._id ?? '' }),
      userId,
      timeCutOff: timeCutOffValue,
      startTime: data?.inTime,
      endTime: data?.outTime,
    };

    handleMutate(payload);
  };
  useEffect(() => {
    if (timecutoff && inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, [timecutoff]);

  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'add' ? 'Add Time Cut Off' : 'Edit Time Cut Off'}
          </DialogTitle>
        </DialogHeader>
        <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <Label htmlFor="inTime" className="mb-4 text-left">
                Start Time <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="inTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    time={field.value || ''}
                    onTimeChange={field.onChange}
                  />
                )}
              />
              {errors.inTime && (
                <span className="text-sm text-red-500">
                  {errors.inTime.message}
                </span>
              )}
            </div>
            <div className="mb-2 flex flex-col">
              <Label htmlFor="outTime" className="mb-4 text-left">
                End Time <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="outTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    time={field.value || ''}
                    onTimeChange={field.onChange}
                  />
                )}
              />
              {errors.outTime && (
                <span className="text-sm text-red-500">
                  {errors.outTime.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="type" className="mb-4 text-left">
                Time Cut Off Minutes<span className="text-red-600">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TooltipProvider>
                    <Tooltip open={isFocused}>
                      <TooltipTrigger asChild>
                        <Input
                          type="text"
                          id="type"
                          placeholder="Enter Time Cut Off Minutes..."
                          {...field}
                          ref={inputRef}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <ul className="list-disc pl-5">
                          <li>
                            Check these minutes carefully as they will impact
                            payroll.
                          </li>
                          <li>
                            These minutes determine the allocated hours for the
                            employee.
                          </li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              />
              {errors.type && (
                <span className="text-sm text-red-500">
                  {errors.type.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isMutating}>
              {type === 'add' ? 'Add' : 'Edit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
