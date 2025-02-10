import React from 'react';

import { Eye } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { MainFormData } from './VerifyCodeForm';

type CNICImage = File | string | null;

export const getPreviewUrl = (fileOrUrl: File | string | null): string => {
  if (fileOrUrl instanceof File) {
    return URL.createObjectURL(fileOrUrl);
  }
  return typeof fileOrUrl === 'string' ? fileOrUrl : '';
};

export function KYC({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<MainFormData>();

  const cnicFrontPicture: CNICImage = watch('kyc.cnicFrontPicture');
  const cnicBackPicture: CNICImage = watch('kyc.cnicBackPicture');

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label htmlFor="bankAccountHolderName" className="mb-2 text-left">
              Account Holder Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="bankAccountHolderName"
              {...register('kyc.bankAccountHolderName')}
              placeholder="First Name"
            />
            {errors.kyc?.bankAccountHolderName && (
              <span className="text-xs text-red-500">
                {errors.kyc.bankAccountHolderName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="bankAccountNumber" className="mb-2 text-left">
              Account Number <span className="text-red-600">*</span>
            </Label>
            <Input
              id="bankAccountNumber"
              {...register('kyc.bankAccountNumber')}
              placeholder="Enter Account Number"
            />
            {errors.kyc?.bankAccountNumber && (
              <span className="text-xs text-red-500">
                {errors.kyc.bankAccountNumber.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="bankBranchName" className="mb-2 text-left">
              Bank Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="bankBranchName"
              {...register('kyc.bankBranchName')}
              placeholder="Bank Name"
            />
            {errors.kyc?.bankBranchName && (
              <span className="text-xs text-red-500">
                {errors.kyc.bankBranchName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="iban" className="mb-2 text-left">
              IBAN Number <span className="text-red-600">*</span>
            </Label>
            <Input
              id="iban"
              {...register('kyc.iban')}
              placeholder="Enter IBAN"
            />
            {errors.kyc?.iban && (
              <span className="text-xs text-red-500">
                {errors.kyc.iban.message}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardHeader>
        <CardTitle>CNIC Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label htmlFor="cnicNumber" className="mb-2 text-left">
              CNIC Number <span className="text-red-600">*</span>
            </Label>
            <Input
              id="cnicNumber"
              {...register('kyc.cnicNumber')}
              placeholder="XXXXX-XXXXXXX-X"
            />
            {errors.kyc?.cnicNumber && (
              <span className="text-xs text-red-500">
                {errors.kyc.cnicNumber.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-left" htmlFor="cnicFrontPicture">
                Front Image CNIC <span className="text-red-600">*</span>
              </Label>
              {cnicFrontPicture && (
                <a
                  href={getPreviewUrl(cnicFrontPicture)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/80 hover:text-primary"
                >
                  <Eye className="size-4" />
                </a>
              )}
            </div>
            <Input
              id="cnicFrontPicture"
              onChange={e => {
                const file = e.target?.files?.[0] || '';
                setValue('kyc.cnicFrontPicture', file);
              }}
              accept="image/jpeg, image/png, image/jpg"
              type="file"
            />
            {errors.kyc?.cnicFrontPicture && (
              <span className="text-xs text-red-500">
                {errors.kyc.cnicFrontPicture.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-left" htmlFor="cnicBackPicture">
                Back Image CNIC <span className="text-red-600">*</span>
              </Label>
              {cnicBackPicture && (
                <a
                  href={getPreviewUrl(cnicBackPicture)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/80 hover:text-primary"
                >
                  <Eye className="size-4" />
                </a>
              )}
            </div>
            <Input
              id="cnicBackPicture"
              onChange={e => {
                const file = e.target?.files?.[0] || '';
                setValue('kyc.cnicBackPicture', file);
              }}
              accept="image/jpeg, image/png, image/jpg"
              type="file"
            />
            {errors.kyc?.cnicBackPicture && (
              <span className="text-xs text-red-500">
                {errors.kyc.cnicBackPicture.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between pt-8">
          <Button variant={'outline'} type="button" onClick={onBack}>
            Back
          </Button>

          <Button onClick={onNext}>Next</Button>
        </div>
      </CardContent>
    </Card>
  );
}
