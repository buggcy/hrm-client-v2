'use client';
import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ChevronDown } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useAllPerkQuery } from '@/hooks/employee/usePerkList.hook';
import { PerkListType } from '@/libs/validations/perk';
import { AvailPerk } from '@/services/employee/perk.service';
import { PerkStoreType } from '@/stores/employee/perks';
import { validateFile } from '@/utils/fileValidation.utils';

import { MessageErrorResponse } from '@/types';
import { Perk } from '@/types/perk.types';
import { User } from '@/types/user.types';

interface PerkModalProps {
  user: User;
  open: boolean;
  type: string;
  perks: Perk[];
  onCloseChange: (open: boolean) => void;
  perkToEdit: PerkListType | null;
}

const FormSchema = z.object({
  perkId: z.string().min(1, 'Please select a perk'),
  increment: z.string().min(1, 'Amount is required'),
  file: z.string().optional(),
  salaryIncrement: z.boolean().optional(),
  assignedIncrement: z.number().optional(),
});

export type PerkFormData = z.infer<typeof FormSchema>;

export function PerkModal({
  open,
  onCloseChange,
  user,
  perks,
  type,
  perkToEdit,
}: PerkModalProps) {
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);
  const [salaryIncrement, setSalaryIncrement] = useState<boolean>(false);
  const [assignedIncrement, setAssignedIncrement] = useState<number>(0);
  const { perkStore } = useStores() as { perkStore: PerkStoreType };
  const { refetch } = useAllPerkQuery(user?.id, {
    enabled: !!user?.id,
  });
  const { setRefetchPerkList } = perkStore;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
  } = useForm<PerkFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      perkId: '',
      increment: '0',
      file: '',
      assignedIncrement: 0,
      salaryIncrement: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: AvailPerk,
    onSuccess: async response => {
      toast({
        title: 'Success',
        description: response?.message || 'Perk Availed Successfully!',
      });
      reset();
      await refetch();
      setRefetchPerkList(true);
      setSelectedPerk(null);
      setSalaryIncrement(false);
      setAssignedIncrement(0);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on avalied perks!',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: PerkFormData) => {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    const file = fileInput?.files ? fileInput.files[0] : null;
    if (type === 'add' && !file) {
      setError('file', {
        type: 'manual',
        message: 'Proof Document is Required!',
      });
      return;
    }
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

    const assignedIncrementAmount = getValues('assignedIncrement') || 0;

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
      formData,
    };
    mutate(payload);
  };

  const handlePerkChange = (perkId: string) => {
    const perk = perks.find(perk => perk._id === perkId);

    if (perk) {
      setSelectedPerk(perk);
      setValue('perkId', perk._id);
      setSalaryIncrement(perk.salaryIncrement);
      setAssignedIncrement(perk.assignedIncrementAmount);
    } else {
      setSelectedPerk(null);
      setValue('perkId', '');
      setSalaryIncrement(false);
      setAssignedIncrement(0);
    }
  };

  useEffect(() => {
    if (selectedPerk) {
      setValue('salaryIncrement', selectedPerk.salaryIncrement);
      setValue('assignedIncrement', selectedPerk.assignedIncrementAmount);
    } else {
      setValue('salaryIncrement', false);
      setValue('assignedIncrement', 0);
    }
  }, [selectedPerk, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
      setSelectedPerk(null);
      setSalaryIncrement(false);
      setAssignedIncrement(0);
    }
  }, [open, reset]);
  useEffect(() => {
    if (type === 'edit' && perkToEdit) {
      reset({
        perkId: perkToEdit?._id || '',
        increment: perkToEdit?.incrementAmount?.toString() || '0',
        file: '',
        assignedIncrement: perkToEdit?.assignedIncrementAmount || 0,
        salaryIncrement: perkToEdit?.salaryIncrement || false,
      });
    }
  }, [perkToEdit, type, reset]);

  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {' '}
            {type === 'edit' ? 'Edit Perk Request' : 'Apply For Perk'}
          </DialogTitle>
        </DialogHeader>
        {(type === 'add' &&
          perks?.some(
            perk =>
              perk.isAvailable &&
              perk.hrApproval === 'available' &&
              perk.salaryIncrement,
          )) ||
        type === 'edit' ? (
          <>
            <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
              {type === 'add' && (
                <div className="flex flex-wrap">
                  <div className="flex flex-1 flex-col">
                    <Label htmlFor="perkId" className="mb-2 text-left">
                      Perks
                    </Label>
                    <Controller
                      name="perkId"
                      control={control}
                      render={() => (
                        <Select
                          onValueChange={value => handlePerkChange(value)}
                        >
                          <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                            <SelectValue placeholder="Select a Perk" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="text-sm">
                              {perks
                                .filter(
                                  perk =>
                                    perk.isAvailable &&
                                    perk.hrApproval === 'available' &&
                                    perk.salaryIncrement,
                                )
                                .map(perk => (
                                  <SelectItem key={perk._id} value={perk._id}>
                                    {perk.name}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                          <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                        </Select>
                      )}
                    />
                  </div>
                </div>
              )}
              {(salaryIncrement || perkToEdit?.salaryIncrement) && (
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
                            placeholder={`Enter Amount (Max: ${assignedIncrement || perkToEdit?.assignedIncrementAmount})`}
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
              )}
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    isPending || (type === 'add' && !getValues('perkId'))
                  }
                >
                  {type === 'edit' ? 'Update' : 'Apply'}
                </Button>
                <Button
                  variant="ghostSecondary"
                  onClick={() => onCloseChange(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <span className="m-3 text-center text-base text-gray-500">
            No Perks Available!
          </span>
        )}
      </DialogContent>
    </Dialog>
  );
}
