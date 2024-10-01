import React from 'react';

import { Eye } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CNICImage = File | string | null;

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
  } = useFormContext();

  const cnicFrontPicture: CNICImage = watch('kyc.cnicFrontPicture');
  const cnicBackPicture: CNICImage = watch('kyc.cnicBackPicture');

  const getPreviewUrl = (fileOrUrl: File | string | null): string => {
    if (fileOrUrl instanceof File) {
      return URL.createObjectURL(fileOrUrl);
    }
    return typeof fileOrUrl === 'string' ? fileOrUrl : '';
  };

  return (
    <Card className="w-[1110px] border-none shadow-none">
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 py-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="bankAccountHolderName" className="mb-2 text-left">
                Account Holder Name
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
            <div className="flex flex-1 flex-col">
              <Label htmlFor="bankAccountNumber" className="mb-2 text-left">
                Account Number
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
            <div className="flex flex-1 flex-col">
              <Label htmlFor="bankBranchName" className="mb-2 text-left">
                Bank Name
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
            <div className="flex flex-1 flex-col">
              <Label htmlFor="iban" className="mb-2 text-left">
                IBAN Number
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
        </div>
      </CardContent>

      <CardHeader>
        <CardTitle>CNIC Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 py-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex w-[241.5px] flex-col">
              <Label htmlFor="cnicNumber" className="mb-2 text-left">
                CNIC Number
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
            <div className="flex w-[241.5px] flex-col">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-left" htmlFor="cnicFrontPicture">
                  Front Image CNIC
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
                onChange={e =>
                  setValue('kyc.cnicFrontPicture', e.target.files[0])
                }
                accept="image/jpeg, image/png, image/jpg"
                type="file"
              />
              {errors.kyc?.cnicFrontPicture && (
                <span className="text-xs text-red-500">
                  {errors.kyc.cnicFrontPicture.message}
                </span>
              )}
            </div>
            <div className="flex w-[241.5px] flex-col">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-left" htmlFor="cnicBackPicture">
                  Back Image CNIC
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
                onChange={e =>
                  setValue('kyc.cnicBackPicture', e?.target?.files[0])
                }
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
        </div>
      </CardContent>
    </Card>
  );
}
