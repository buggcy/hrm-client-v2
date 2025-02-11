'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Eye } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { KycType } from '@/libs/validations/edit-employee';
import { updateEmployeeKYC } from '@/services/hr/edit-employee.service';
import { EditEmployeeStoreType } from '@/stores/hr/edit-employee';

import { MessageErrorResponse } from '@/types';

interface KYCProps {
  empId?: string;
  data?: KycType;
}

const kycSchema = z.object({
  empId: z.string(),
  cnic: z
    .string()
    .min(15)
    .max(15)
    .regex(/^\d{5}-\d{7}-\d{1}$/),
  frontPicture: z
    .instanceof(File)
    .nullable()
    .refine(file => file === null || file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    }),
  backPicture: z
    .instanceof(File)
    .nullable()
    .refine(file => file === null || file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    }),
  accountHolderName: z.string(),
  accountNumber: z.string(),
  branchName: z.string(),
  iban: z.string(),
});

export type KYCFormData = z.infer<typeof kycSchema>;

const KYC = ({ data, empId }: KYCProps) => {
  const { editEmployeeStore } = useStores() as {
    editEmployeeStore: EditEmployeeStoreType;
  };
  const { setRefetchEditEmployeeData } = editEmployeeStore;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    clearErrors,
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      empId: empId || '',
      cnic: data?.cnic.number || '',
      frontPicture: null,
      backPicture: null,
      accountHolderName: data?.bankDetails.accountHolderName ?? '',
      accountNumber: data?.bankDetails.accountNumber || '',
      branchName: data?.bankDetails.branchName || '',
      iban: data?.bankDetails.iban || '',
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: updateEmployeeKYC,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on adding employee!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchEditEmployeeData(true);
    },
  });
  const onSubmit = (newData: KYCFormData) => {
    const formData = new FormData();
    formData.append('cnicFrontPicture', newData.frontPicture || '');
    formData.append('cnicBackPicture', newData.backPicture || '');
    formData.append('cnicNumber', newData.cnic);
    formData.append('bankAccountHolderName', newData.accountHolderName);
    formData.append('bankAccountNumber', newData.accountNumber);
    formData.append('bankBranchName', newData.branchName);
    formData.append('iban', newData.iban);
    formData.append('userId', empId || '');
    mutate({
      id: data?._id || '',
      body: formData,
    });
  };

  const cnicNumber = watch('cnic');

  useEffect(() => {
    if (cnicNumber && cnicNumber.length === 15) {
      if (!/^\d{5}-\d{7}-\d{1}$/.test(cnicNumber)) {
        setError('cnic', {
          type: 'manual',
          message: 'Invalid CNIC number',
        });
      } else {
        clearErrors('cnic');
      }
    }
  }, [clearErrors, cnicNumber, setError]);

  useEffect(() => {
    if (data) {
      reset({
        empId: empId || '',
        cnic: data?.cnic.number || '',
        frontPicture: null,
        backPicture: null,
        accountHolderName: data?.bankDetails.accountHolderName ?? '',
        accountNumber: data?.bankDetails.accountNumber || '',
        branchName: data?.bankDetails.branchName || '',
        iban: data?.bankDetails.iban || '',
      });
    }
  }, [data, empId, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-4">
      <div className="mb-4 flex flex-col gap-8">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col">
            <Label htmlFor="cnic" className="mb-2 text-left">
              CNIC <span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="cnic"
              control={control}
              render={({ field }) => (
                <Input {...field} id="cnic" placeholder="12345-1234567-1" />
              )}
            />
            {errors.cnic && (
              <span className="text-sm text-red-500">
                {errors.cnic.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="frontPicture"
              className="mb-2 flex flex-row items-center gap-2 text-left"
            >
              Choose Document
              {data?.cnic.frontPicture && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Eye
                        className="ml-2 inline size-4 cursor-pointer text-primary/80 hover:text-primary"
                        onClick={() =>
                          data?.cnic.frontPicture &&
                          window.open(String(data?.cnic.frontPicture), '_blank')
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>Click to Preview Image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Label>
            <Controller
              name="frontPicture"
              control={control}
              render={({ field }) => (
                <Input
                  id="frontPicture"
                  placeholder="Choose a file"
                  type="file"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                  }}
                />
              )}
            />
            {errors.frontPicture && (
              <span className="text-sm text-red-500">
                {errors.frontPicture.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="backPicture"
              className="mb-2 flex flex-row items-center gap-2 text-left"
            >
              Choose Document
              {data?.cnic.backPicture && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Eye
                        className="ml-2 inline size-4 cursor-pointer text-primary/80 hover:text-primary"
                        onClick={() =>
                          data?.cnic.backPicture &&
                          window.open(String(data?.cnic.backPicture), '_blank')
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>Click to Preview Image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Label>
            <Controller
              name="backPicture"
              control={control}
              render={({ field }) => (
                <Input
                  id="backPicture"
                  placeholder="Choose a file"
                  type="file"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                  }}
                />
              )}
            />
            {errors.backPicture && (
              <span className="text-sm text-red-500">
                {errors.backPicture.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label htmlFor="accountHolderName" className="mb-2 text-left">
              Account Name <span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="accountHolderName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="accountHolderName"
                  placeholder="John Doe"
                />
              )}
            />
            {errors.accountHolderName && (
              <span className="text-sm text-red-500">
                {errors.accountHolderName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="accountNumber" className="mb-2 text-left">
              AccountNumber <span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="accountNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="accountNumber"
                  placeholder="1234567"
                  type="number"
                />
              )}
            />
            {errors.accountNumber && (
              <span className="text-sm text-red-500">
                {errors.accountNumber.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="branchName" className="mb-2 text-left">
              Bank Name <span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="branchName"
              control={control}
              render={({ field }) => (
                <Input {...field} id="branchName" placeholder="HBL" />
              )}
            />
            {errors.branchName && (
              <span className="text-sm text-red-500">
                {errors.branchName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="iban" className="mb-2 text-left">
              IBAN Number <span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="iban"
              control={control}
              render={({ field }) => (
                <Input {...field} id="iban" placeholder="PKL12345" />
              )}
            />
            {errors.iban && (
              <span className="text-sm text-red-500">
                {errors.iban.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </DialogFooter>
    </form>
  );
};

export default KYC;
