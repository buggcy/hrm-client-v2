'use client';
import React, { useEffect } from 'react';

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
import { useStores } from '@/providers/Store.Provider';

import { useAllPerkQuery } from '@/hooks/employee/usePerkList.hook';
import { TransformedPerkData } from '@/libs/validations/perk';
import { updateAvailPerk } from '@/services/employee/perk.service';
import { PerkStoreType } from '@/stores/employee/perks';
import { validateFile } from '@/utils/fileValidation.utils';

import { MessageErrorResponse } from '@/types';
import { User } from '@/types/user.types';

interface PerkModalProps {
  user: User;
  open: boolean;
  onCloseChange: (open: boolean) => void;
  perkToEdit: TransformedPerkData | null;
}

const FormSchema = z.object({
  perkId: z.string().min(1, 'Please select a perk'),
  requestId: z.string().min(1, 'Request ID is required'),
  increment: z.string().min(1, 'Amount is required'),
  file: z.string().optional(),
});

export type PerkFormData = z.infer<typeof FormSchema>;

export function EditPerkModal({
  open,
  onCloseChange,
  user,
  perkToEdit,
}: PerkModalProps) {
  const { perkStore } = useStores() as { perkStore: PerkStoreType };
  const { refetch } = useAllPerkQuery(user?.id, {
    enabled: !!user?.id,
  });
  const { setRefetchPerkList } = perkStore;
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
    reset,
  } = useForm<PerkFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      perkId: '',
      requestId: '',
      increment: perkToEdit?.incrementAmount.toString() || '',
      file: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateAvailPerk,
    onSuccess: async response => {
      toast({
        title: 'Success',
        description: response?.message || 'Perk Availed Successfully!',
        variant: 'success',
      });
      reset();
      await refetch();
      setRefetchPerkList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on avalied perks!',
        variant: 'error',
      });
    },
  });

  const onSubmit = (data: PerkFormData) => {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    const file = fileInput?.files ? fileInput.files[0] : null;
    const fileError = validateFile(file);
    if (fileError) {
      setError('file', {
        type: 'manual',
        message: fileError,
      });
      return;
    } else {
      clearErrors('file');
    }

    const assignedIncrementAmount = perkToEdit?.assignedIncrementAmount || 0;

    if (Number(data?.increment) > assignedIncrementAmount) {
      setError('increment', {
        type: 'manual',
        message: 'Requested Amount Exceeds Assigned Max Amount',
      });
      return;
    } else {
      clearErrors('increment');
    }
    const formData = new FormData();
    formData.append('incrementAmount', data?.increment);
    if (file) {
      formData.append('proofPerkDocument', file);
    }

    const payload = {
      employeeId: user?.id,
      perkId: data?.perkId,
      applicationId: perkToEdit?.requestId || '',
      formData,
    };
    mutate(payload);
  };

  useEffect(() => {
    if (perkToEdit) {
      reset({
        perkId: perkToEdit.id || '',
        requestId: perkToEdit.requestId || '',
        increment: perkToEdit.incrementAmount.toString(),
        file: '',
      });
    }
  }, [perkToEdit, reset]);

  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Perk Request</DialogTitle>
        </DialogHeader>
        <>
          <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
            <>
              <div className="flex flex-wrap">
                <div className="flex flex-1 flex-col">
                  <Label htmlFor="increment" className="mb-2 text-left">
                    Amount
                  </Label>
                  <Controller
                    name="increment"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        id="increment"
                        placeholder={`Enter Amount (Max: ${perkToEdit?.assignedIncrementAmount})`}
                        {...field}
                      />
                    )}
                  />
                  {errors.increment && (
                    <span className="text-sm text-red-500">
                      {errors.increment.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="flex flex-1 flex-col">
                  <Label htmlFor="file" className="mb-2 text-left">
                    Proof Document
                  </Label>
                  <Controller
                    name="file"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="file"
                        id="file"
                        placeholder="Browse for a file to upload..."
                        {...field}
                      />
                    )}
                  />

                  {errors.file && (
                    <span className="text-sm text-red-500">
                      {errors.file.message}
                    </span>
                  )}
                </div>
              </div>
            </>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending || !getValues('perkId')}
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </>
      </DialogContent>
    </Dialog>
  );
}
