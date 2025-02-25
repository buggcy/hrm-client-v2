'use client';

import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { addPerk } from '@/services/hr/perks-list.service';
import { PerkListStoreType } from '@/stores/hr/perk-list';

import { MessageErrorResponse } from '@/types';

const addPerkSchema = z.object({
  name: z.string(),
  description: z.string().default(''),
  salaryIncrement: z.boolean(),
  salaryDecrement: z.boolean(),
});

export type AddPerkFormData = z.infer<typeof addPerkSchema>;

interface AddPerkDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
}

export function AddPerksDialog({
  open,
  onOpenChange,
  onCloseChange,
}: AddPerkDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    setError,
    clearErrors,
  } = useForm<AddPerkFormData>({
    resolver: zodResolver(addPerkSchema),
    defaultValues: {
      name: '',
      description: '',
      salaryIncrement: false,
      salaryDecrement: false,
    },
  });

  const { perkListStore } = useStores() as { perkListStore: PerkListStoreType };
  const { setRefetchPerkList } = perkListStore;

  const { mutate: addPerkData, isPending: isAdding } = useMutation({
    mutationFn: addPerk,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on adding perk!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      reset();
      onCloseChange();
      setRefetchPerkList(true);
    },
  });

  const onSubmit = (data: AddPerkFormData) => {
    if (data.salaryIncrement && data.salaryDecrement) {
      setError('salaryDecrement', {
        type: 'manual',
        message: '',
      });
      return;
    } else if (!data.salaryIncrement && !data.salaryDecrement) {
      setError('salaryDecrement', {
        type: 'manual',
        message:
          'At least one of salary increment or decrement should be selected',
      });
      return;
    }
    addPerkData(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle>Add Perk</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 py-4">
          <div className="grid grid-cols-1 gap-8">
            <div className="flex flex-col">
              <Label htmlFor="name" className="mb-2 text-left">
                Name
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="name" placeholder="Name" />
                )}
              />
              {errors.name && (
                <span className="text-sm text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="description" className="mb-2 text-left">
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Description"
                    className="max-h-48"
                  />
                )}
              />
              {errors.description && (
                <span className="text-sm text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-row items-center gap-4">
                <Label htmlFor="salaryIncrement" className="text-left">
                  Salary Increment
                </Label>
                <Controller
                  name="salaryIncrement"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="salaryIncrement"
                      checked={field.value}
                      onCheckedChange={(checked: boolean) => {
                        field.onChange();
                        setValue('salaryIncrement', checked);
                        const salaryIncrement = getValues('salaryIncrement');
                        const salaryDecrement = getValues('salaryDecrement');
                        if (salaryIncrement && salaryDecrement) {
                          setError('salaryDecrement', {
                            type: 'manual',
                            message:
                              'Both salary increment and decrement cannot be selected',
                          });
                        } else {
                          clearErrors('salaryDecrement');
                        }
                      }}
                    />
                  )}
                />
                {errors.salaryIncrement && (
                  <span className="text-sm text-red-500">
                    {errors.salaryIncrement.message}
                  </span>
                )}
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label htmlFor="salaryDecrement" className="text-left">
                  Salary Decrement
                </Label>
                <Controller
                  name="salaryDecrement"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="salaryDecrement"
                      checked={field.value}
                      onCheckedChange={(checked: boolean) => {
                        field.onChange();
                        setValue('salaryDecrement', checked);
                        const salaryIncrement = getValues('salaryIncrement');
                        const salaryDecrement = getValues('salaryDecrement');
                        if (salaryIncrement && salaryDecrement) {
                          setError('salaryDecrement', {
                            type: 'manual',
                            message:
                              'Both salary increment and decrement cannot be selected',
                          });
                        } else {
                          clearErrors('salaryDecrement');
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>
            {errors.salaryDecrement && (
              <span className="text-sm text-red-500">
                {errors.salaryDecrement.message}
              </span>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isAdding}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
