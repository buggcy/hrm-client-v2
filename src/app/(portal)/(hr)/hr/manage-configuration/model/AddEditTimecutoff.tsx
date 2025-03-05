import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
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
import { toast } from '@/components/ui/use-toast';

import { ConfigurationType } from '@/libs/validations/hr-configuration';
import { addTimeCutOffType } from '@/services/hr/hrConfiguration.service';

import { formatUTCToLocalTime } from '../../manage-attendance/attendance-list/components/AttendanceDialog';

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
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<TypeFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: '',
      inTime:
        type === 'edit' && TypeToEdit?.startTime
          ? formatUTCToLocalTime(TypeToEdit.startTime)
          : '',
      outTime:
        type === 'edit' && TypeToEdit?.endTime
          ? formatUTCToLocalTime(TypeToEdit.endTime ?? '')
          : '',
    },
  });

  useEffect(() => {
    if (type === 'edit' && TypeToEdit) {
      reset({
        type: TypeToEdit?.timeCutOff?.toString() || '',
      });
    }
  }, [TypeToEdit, type, reset]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const { mutate: AddTimeCutOffMutate, isPending: AddTimeCutOffPending } =
    useMutation({
      mutationFn: addTimeCutOffType,
      onSuccess: response => {
        toast({
          title: 'Success',
          description: response?.message || 'Time Cut Off Added Successfully!',
          variant: 'success',
        });
        reset();
        setRefetchConfigurationList(true);
        onCloseChange(false);
      },
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description: err.message || 'Error on adding time cut off!',
          variant: 'error',
        });
      },
    });

  const onSubmit = (data: TypeFormData) => {
    if (!Number(data?.type)) {
      setError('type', {
        message: 'Time Cut Off must be a number',
      });
      return;
    }
    if (Number(data?.type) <= 0) {
      setError('type', {
        message: 'Time Cut Off must be a positive number',
      });
      return;
    }
    const addTimeCutOffPayload = {
      userId,
      timeCutOff: Number(data?.type),
      startTime: data?.inTime,
      endTime: data?.outTime,
    };

    if (type === 'add') {
      AddTimeCutOffMutate(addTimeCutOffPayload);
    }
  };

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
            <div className="flex flex-col">
              <Label htmlFor="type" className="mb-4 text-left">
                {'Time Cut Off Minutes'}
                <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="type"
                    placeholder={`Enter Time Cut Off Minutes...`}
                    {...field}
                  />
                )}
              />
              {errors.type && (
                <span className="text-sm text-red-500">
                  {errors.type.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="inTime" className="mb-4 text-left">
                Start Time <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="inTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    time={field.value}
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
            <div className="flex flex-col">
              <Label htmlFor="outTime" className="mb-4 text-left">
                End Time <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="outTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    time={field.value}
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
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={type === 'add' ? AddTimeCutOffPending : false}
            >
              {type === 'add' ? 'Add' : 'Edit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
