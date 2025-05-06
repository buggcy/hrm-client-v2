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
import FormattedTextArea from '@/components/ui/FormattedTextArea';
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
import { AvailPerk } from '@/services/employee/perk.service';
import { PerkStoreType } from '@/stores/employee/perks';

import { MessageErrorResponse } from '@/types';
import { Perk } from '@/types/perk.types';
import { User } from '@/types/user.types';

interface PerkModalProps {
  user: User;
  open: boolean;
  perks: Perk[];
  onCloseChange: (open: boolean) => void;
}

const FormSchema = z.object({
  perkId: z.string().min(1, 'Please select a perk'),
  increment: z.string().min(1, 'Amount is required'),
  description: z.string().min(1, 'Description is required'),
  file: z
    .instanceof(File)
    .refine(file => file.size <= 800 * 1024, 'File size must not exceed 800KB')
    .refine(
      file =>
        ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'].includes(
          file.type,
        ),
      'Only PDF, PNG, JPG, and JPEG files are allowed',
    ),
});

export type PerkFormData = z.infer<typeof FormSchema>;

export function PerkModal({
  open,
  onCloseChange,
  user,
  perks,
}: PerkModalProps) {
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);
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
    setError,
    clearErrors,
    reset,
  } = useForm<PerkFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      perkId: '',
      increment: '0',
      description: '',
      file: undefined,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: AvailPerk,
    onSuccess: async response => {
      toast({
        title: 'Success',
        description: response?.message || 'Perk Availed Successfully!',
        variant: 'success',
      });
      reset();
      await refetch();
      setRefetchPerkList(true);
      setSelectedPerk(null);
      setAssignedIncrement(0);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on avalied perks!',
        variant: 'error',
      });
    },
  });

  const onSubmit = (data: PerkFormData) => {
    if (Number(data?.increment) > assignedIncrement) {
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
    const file = data?.file;
    if (file) {
      formData.append('proofPerkDocument', file);
    }
    formData.append('description', data?.description);

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
      setAssignedIncrement(perk.assignedIncrementAmount);
    } else {
      setSelectedPerk(null);
      setValue('perkId', '');
      setAssignedIncrement(0);
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
      setSelectedPerk(null);
      setAssignedIncrement(0);
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply For Perk</DialogTitle>
        </DialogHeader>
        {perks?.some(
          perk => perk.isAvailable && !perk.isAvailed && perk.salaryIncrement,
        ) ? (
          <>
            <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-wrap">
                <div className="flex flex-1 flex-col">
                  <Label htmlFor="perkId" className="mb-2 text-left">
                    Perks
                  </Label>
                  <Controller
                    name="perkId"
                    control={control}
                    render={() => (
                      <Select onValueChange={value => handlePerkChange(value)}>
                        <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                          <SelectValue placeholder="Select a Perk" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="text-sm">
                            {perks
                              .filter(
                                perk =>
                                  perk.isAvailable &&
                                  !perk.isAvailed &&
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

              {selectedPerk && (
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
                            placeholder={`Enter Amount (Max: ${assignedIncrement})`}
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
                  <div className="flex flex-col">
                    <Label htmlFor="description" className="mb-2 text-left">
                      Description <span className="text-red-600">*</span>
                    </Label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <FormattedTextArea
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      )}
                    />

                    {errors.description && (
                      <span className="text-sm text-red-500">
                        {errors.description.message}
                      </span>
                    )}
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
                            accept=".png, .jpeg, .jpg, .pdf"
                            placeholder="Browse for a file to upload..."
                            onChange={e => {
                              const file = e.target.files?.[0];
                              field.onChange(file);
                            }}
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
                <Button type="submit" disabled={isPending}>
                  Apply
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
