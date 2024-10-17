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

import { ConfigurationType } from '@/libs/validations/hr-configuration';
import {
  addEducationType,
  editEducationType,
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
const FormSchema = z.object({
  educationType: z.string().min(1, 'Education type is required'),
});

export type TypeFormData = z.infer<typeof FormSchema>;

export function AddEditTypeDialog({
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
  } = useForm<TypeFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      educationType: '',
    },
  });

  useEffect(() => {
    if (type === 'edit' && TypeToEdit) {
      reset({
        educationType: TypeToEdit?.educationType || '',
      });
    }
  }, [TypeToEdit, type, reset]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);
  const { mutate, isPending } = useMutation({
    mutationFn: addEducationType,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Education Type Added Successfully!',
      });
      reset();
      setRefetchConfigurationList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on adding education type!',
        variant: 'destructive',
      });
    },
  });
  const { mutate: EditMutate, isPending: EditPending } = useMutation({
    mutationFn: editEducationType,
    onSuccess: response => {
      toast({
        title: 'Success',
        description:
          response?.message || 'Education Type Updated Successfully!',
      });
      reset();
      setRefetchConfigurationList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on updating the education type!',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: TypeFormData) => {
    const addPayload = {
      userId,
      educationType: data?.educationType,
    };
    const editPayload = {
      id: TypeToEdit?._id ?? '',
      userId,
      educationType: data?.educationType,
    };
    if (type === 'add') {
      mutate(addPayload);
    } else {
      EditMutate(editPayload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {' '}
            {type === 'add' ? 'Add Education Type' : 'Edit Education Type'}
          </DialogTitle>
        </DialogHeader>
        <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="educationType" className="mb-2 text-left">
                Education Type
              </Label>
              <Controller
                name="educationType"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="educationType"
                    placeholder="Enter Education Type..."
                    {...field}
                  />
                )}
              />
              {errors.educationType && (
                <span className="text-sm text-red-500">
                  {errors.educationType.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={type === 'add' ? isPending : EditPending}
            >
              {type === 'add' ? 'Add' : 'Update'}
            </Button>
            <Button
              variant="ghostSecondary"
              type="button"
              onClick={() => {
                reset();
                onCloseChange(false);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
