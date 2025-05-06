import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

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

import { TaxType } from '@/libs/validations/hr-configuration';
import { addTax, editTax } from '@/services/hr/hrConfiguration.service';

import { MessageErrorResponse } from '@/types';

interface DialogProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  type: string;
  userId: string;
  setRefetchConfigurationList: (refetch: boolean) => void;
  TypeToEdit: TaxType | null;
}

const FormSchema = z.object({
  from: z.string().min(1, 'From is required'),
  to: z.string().min(1, 'To is required'),
  percentage: z.string().min(1, 'Percentage is required'),
});

export type TypeFormData = z.infer<typeof FormSchema>;

export function AddEditTax({
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
      from: '',
      to: '',
      percentage: '',
    },
  });

  useEffect(() => {
    if (type === 'edit' && TypeToEdit) {
      reset({
        from: TypeToEdit?.from?.toString() || '',
        to: TypeToEdit?.to?.toString() || '',
        percentage: TypeToEdit?.percentage?.toString() || '',
      });
    }
  }, [TypeToEdit, type, reset]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleMutation = useMutation({
    mutationFn: (data: {
      userId: string;
      from: number;
      to: number;
      percentage: number;
      id?: string;
    }) => {
      if (type === 'edit' && !data.id) {
        throw new Error('ID is required for editing tax range');
      }
      return type === 'add'
        ? addTax(data)
        : editTax({ ...data, id: data.id as string });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description:
          response?.message ||
          `Tax Range ${type === 'add' ? 'Added' : 'Updated'} Successfully!`,
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
          `Error on ${type === 'add' ? 'adding' : 'updating'} tax range!`,
        variant: 'error',
      });
    },
  });

  const { mutate: handleMutate, isPending: isMutating } = handleMutation;

  const onSubmit = (data: TypeFormData) => {
    const from = Number(data?.from);
    const to = Number(data?.to);
    const percentage = Number(data?.percentage);

    if (isNaN(from) || from <= 0) {
      setError('from', {
        message: 'From must be a positive number',
      });
      return;
    }
    if (isNaN(to) || to <= 0) {
      setError('to', {
        message: 'To must be a positive number',
      });
      return;
    }
    if (isNaN(percentage) || percentage <= 0) {
      setError('percentage', {
        message: 'Percentage must be a positive number',
      });
      return;
    }

    const payload = {
      ...(type === 'edit' && { id: TypeToEdit?._id ?? '' }),
      userId,
      from,
      to,
      percentage,
    };

    handleMutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'add' ? 'Add Tax Range' : 'Edit Tax Range'}
          </DialogTitle>
        </DialogHeader>
        <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <Label htmlFor="from" className="mb-4 text-left">
                Tax Range (From)<span className="text-red-600">*</span>
              </Label>
              <Controller
                name="from"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="from"
                    placeholder="Enter Tax range (from)..."
                    {...field}
                  />
                )}
              />
              {errors.from && (
                <span className="text-sm text-red-500">
                  {errors.from.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="to" className="mb-4 text-left">
                Tax Range (To)<span className="text-red-600">*</span>
              </Label>
              <Controller
                name="to"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="to"
                    placeholder="Enter Tax range (to)..."
                    {...field}
                  />
                )}
              />
              {errors.to && (
                <span className="text-sm text-red-500">
                  {errors.to.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="percentage" className="mb-4 text-left">
                Tax Percentage<span className="text-red-600">*</span>
              </Label>
              <Controller
                name="percentage"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="percentage"
                    placeholder="Enter Tax percentage..."
                    {...field}
                  />
                )}
              />
              {errors.percentage && (
                <span className="text-sm text-red-500">
                  {errors.percentage.message}
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
