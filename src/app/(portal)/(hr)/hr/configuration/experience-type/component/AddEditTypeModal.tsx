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
  addExperienceType,
  editExperienceType,
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
  experienceType: z.string().min(1, 'Experience type is required'),
});

export type TypeFormData = z.infer<typeof FormSchema>;

export function AddEditExperienceTypeDialog({
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
      experienceType: '',
    },
  });

  useEffect(() => {
    if (type === 'edit' && TypeToEdit) {
      reset({
        experienceType: TypeToEdit?.experienceType || '',
      });
    }
  }, [TypeToEdit, type, reset]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);
  const { mutate, isPending } = useMutation({
    mutationFn: addExperienceType,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Experience Type Added Successfully!',
      });
      reset();
      setRefetchConfigurationList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on adding experience type!',
        variant: 'destructive',
      });
    },
  });
  const { mutate: EditMutate, isPending: EditPending } = useMutation({
    mutationFn: editExperienceType,
    onSuccess: response => {
      toast({
        title: 'Success',
        description:
          response?.message || 'Experience Type Updated Successfully!',
      });
      reset();
      setRefetchConfigurationList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on updating the experience type!',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: TypeFormData) => {
    const addPayload = {
      userId,
      experienceType: data?.experienceType,
    };
    const editPayload = {
      id: TypeToEdit?._id ?? '',
      userId,
      experienceType: data?.experienceType,
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
            {type === 'add' ? 'Add Experience Type' : 'Edit Experience Type'}
          </DialogTitle>
        </DialogHeader>
        <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="experienceType" className="mb-2 text-left">
                Experience Type
              </Label>
              <Controller
                name="experienceType"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="experienceType"
                    placeholder="Enter Experience Type..."
                    {...field}
                  />
                )}
              />
              {errors.experienceType && (
                <span className="text-sm text-red-500">
                  {errors.experienceType.message}
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
