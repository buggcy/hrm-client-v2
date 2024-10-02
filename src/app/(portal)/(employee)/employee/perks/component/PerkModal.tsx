'use client';
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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

import { useTypesQuery } from '@/hooks/types.hook';
import { AvailPerk } from '@/services/employee/perk.service';
import { validateFile } from '@/utils/fileValidation.utils';

import { User } from '@/types/user.types';
interface PerkModalProps {
  user: User;
  open: boolean;
  onCloseChange: (open: boolean) => void;
}
const FormSchema = z.object({
  perkId: z.string(),
  increment: z
    .number()
    .min(1, 'Amount is required')
    .max(1500, 'Amount cannot exceed 1500'),
  file: z.string().optional(),
});
export type PerkFormData = z.infer<typeof FormSchema>;
export function PerkModal({ open, onCloseChange, user }: PerkModalProps) {
  const { isLoading } = useTypesQuery();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PerkFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file: '',
      increment: 0,
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: AvailPerk,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Perk Availed Successfully!',
      });
      reset();
    },
    onError: err => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on avalied perks!',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: PerkFormData) => {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    const fileError = validateFile(file);
    if (fileError) {
      toast({
        title: 'File Error',
        description: fileError,
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('incrementAmount', String(data.increment));

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

  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for Perks</DialogTitle>
        </DialogHeader>
        <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="perkId" className="mb-2 text-left">
                Perks
              </Label>
              <Select>
                <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                  <SelectValue placeholder="Select Perks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="text-sm">
                    <SelectItem value="No Perks Available" disabled>
                      Select Perks
                    </SelectItem>

                    <SelectItem value={'Bike'} className="capitalize">
                      {'Bike'}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
                <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
              </Select>
            </div>
          </div>
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
                    type={'number'}
                    id="increment"
                    placeholder="Enter Ammount (Max: 1500)"
                    {...field}
                  />
                )}
              />{' '}
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
                    type={'file'}
                    id="file"
                    placeholder="Browse for a file to upload..."
                    {...field}
                  />
                )}
              />{' '}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || isPending}>
              Apply
            </Button>
            <Button variant={'ghostSecondary'} onClick={() => onCloseChange}>
              Close
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
