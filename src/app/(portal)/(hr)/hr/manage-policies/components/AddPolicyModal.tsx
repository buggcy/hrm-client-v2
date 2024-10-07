'use client';

import React from 'react';

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

import { useTypesQuery } from '@/hooks/types.hook';
import { policyService } from '@/services/hr/policies.service';
import { AuthStoreType } from '@/stores/auth';

import { MessageErrorResponse } from '@/types';

// Define the validation schema using Zod
const addPolicySchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  file: z
    .instanceof(File)
    .refine(file => file.size <= 200 * 1024, 'File size should be under 200KB')
    .refine(
      file =>
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/svg+xml',
        ].includes(file.type),
      'Unsupported file format',
    ),
  userId: z.string(),
});

export type AddPolicyFormData = z.infer<typeof addPolicySchema>;

export interface DialogDemoProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
}

export function PolicyDialog({
  open,
  onOpenChange,
  onCloseChange,
}: DialogDemoProps) {
  const { isLoading } = useTypesQuery();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddPolicyFormData>({
    resolver: zodResolver(addPolicySchema),
    defaultValues: {
      category: '',
      file: null as unknown as File,
      userId: user?.id,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: policyService.addPolicy,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error adding policy!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
      });
      reset();
      onCloseChange();
    },
  });

  const onSubmit = (data: AddPolicyFormData) => {
    const userId = data.userId;
    const categeory = data.category;
    const file = data.file;

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('category', categeory);
    formData.append('file', file);
    console.log('on submit data', formData);
    mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Policy</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="flex flex-col">
            <Label className="mb-2" htmlFor="category">
              Category
            </Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 overflow-y-auto">
                    <SelectGroup>
                      <SelectItem value="Company Policy">
                        Company Policy
                      </SelectItem>
                      <SelectItem value="Attendance Policy">
                        Attendance Policy
                      </SelectItem>
                      <SelectItem value="Personnel Policy">
                        Personnel Policy
                      </SelectItem>
                      <SelectItem value="Safety Policy">
                        Safety Policy
                      </SelectItem>
                      <SelectItem value="Technology Policy">
                        Technology Policy
                      </SelectItem>
                      <SelectItem value="Privacy Policy">
                        Privacy Policy
                      </SelectItem>
                      <SelectItem value="Payment Policy">
                        Payment Policy
                      </SelectItem>
                      <SelectItem value="Confidentiality Policy">
                        Confidentiality Policy
                      </SelectItem>
                      <SelectItem value="Performance Policy">
                        Employee Performance Policy
                      </SelectItem>
                      <SelectItem value="Retention Policy">
                        Retention Policy
                      </SelectItem>
                      <SelectItem value="Disciplinary Policy">
                        Disciplinary Action Policy
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <span className="text-sm text-red-500">
                {errors.category.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label className="mb-2" htmlFor="file">
              Upload File
            </Label>
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpeg,.png,.gif,.svg"
                  onChange={e => field.onChange(e.target.files?.[0] || null)}
                />
              )}
            />
            {errors.file && (
              <span className="text-sm text-red-500">
                {errors.file.message}
              </span>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading || isPending}>
              Add Policy
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
