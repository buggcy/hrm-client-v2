import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { toast } from '@/components/ui/use-toast';

import { OvertimeListType } from '@/libs/validations/overtime';
import {
  applyOvertime,
  updateOvertime,
} from '@/services/employee/overtime.service';
import { useAuthStore } from '@/stores/auth';
import { formatedDate } from '@/utils';

import { MessageErrorResponse } from '@/types';

interface DialogProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  type: string;
  setRefetchOvertimeList: (refetch: boolean) => void;
  TypeToEdit: OvertimeListType | null;
}

const FormSchema = z.object({
  overtimeMinutes: z.string().min(1, 'Overtime Minutes is required'),
  date: z.date(),
  reason: z.string().min(1, 'Overtime Reason is required'),
});

export type TypeFormData = z.infer<typeof FormSchema>;

export function AddEditOvertime({
  open,
  onCloseChange,
  type,
  setRefetchOvertimeList,
  TypeToEdit,
}: DialogProps) {
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<TypeFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      overtimeMinutes: TypeToEdit?.overtimeMinutes?.toString() || '',
      reason: TypeToEdit?.reason || '',
      date: TypeToEdit?.date ? new Date(TypeToEdit.date) : new Date(),
    },
  });

  useEffect(() => {
    if (type === 'edit' && TypeToEdit) {
      reset({
        overtimeMinutes: TypeToEdit?.overtimeMinutes?.toString() || '',
        date: TypeToEdit?.date ? new Date(TypeToEdit.date) : new Date(),
        reason: TypeToEdit?.reason || '',
      });
    }
  }, [TypeToEdit, type, reset]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const { mutate: AddMutate, isPending: AddPending } = useMutation({
    mutationFn: applyOvertime,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Overtime Applied Successfully!',
        variant: 'success',
      });
      reset();
      setRefetchOvertimeList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on appling for overtime !',
        variant: 'error',
      });
    },
  });
  const { mutate: EditMutate, isPending: EditPending } = useMutation({
    mutationFn: updateOvertime,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on cancel overtime!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchOvertimeList(true);
      onCloseChange(false);
    },
  });
  const onSubmit = (data: TypeFormData) => {
    if (!Number(data?.overtimeMinutes)) {
      setError('overtimeMinutes', {
        message: 'Overtime Minutes must be a number',
      });
      return;
    }
    if (Number(data?.overtimeMinutes) <= 0) {
      setError('overtimeMinutes', {
        message: 'Overtime Minutes must be a positive number',
      });
      return;
    }
    const addPayload = {
      userId,
      overtimeMinutes: Number(data?.overtimeMinutes),
      date: formatedDate(data?.date),
      reason: data?.reason,
    };

    const editPayload = {
      overtimeMinutes: Number(data?.overtimeMinutes),
      date: formatedDate(data?.date),
      reason: data?.reason,
    };
    if (type === 'add') {
      AddMutate({ body: addPayload });
    }
    if (type === 'edit') {
      EditMutate({ id: TypeToEdit?._id || '', body: editPayload });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'add' ? 'Apply For Overtime' : 'Edit Overtime'}
          </DialogTitle>
        </DialogHeader>
        <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <Label htmlFor="date" className="mb-2 text-left">
                Overtime Date
              </Label>
              <Controller
                name="date"
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
              {errors.date && (
                <span className="text-sm text-red-500">
                  {errors.date.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="type" className="mb-4 text-left">
                {'Overtime Minutes'}
                <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="overtimeMinutes"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="type"
                    placeholder={`Enter Overtime Minutes...`}
                    {...field}
                  />
                )}
              />
              {errors.overtimeMinutes && (
                <span className="text-sm text-red-500">
                  {errors.overtimeMinutes.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="reason" className="mb-2 text-left">
                Overtime Reason
              </Label>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <FormattedTextArea
                    value={field.value || ''}
                    onChange={field.onChange}
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
          <DialogFooter>
            <Button
              type="submit"
              disabled={type === 'add' ? AddPending : EditPending}
            >
              {type === 'add' ? 'Apply' : 'Edit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
