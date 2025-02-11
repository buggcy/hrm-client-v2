'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';

import CustomDayPicker from '@/components/CustomDayPicker';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useTypesQuery } from '@/hooks/types.hook';

import {
  educationExperienceSchema,
  EducationExperienceType,
} from './VerifyCodeForm';

interface EduExpProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
  handleExperienceSubmit: (data: EducationExperienceType) => void;
  editingItem: EducationExperienceType | null;
  userId: string;
}

export function EduEpxDialog({
  open,
  onOpenChange,
  onCloseChange,
  handleExperienceSubmit,
  editingItem,
  userId,
}: EduExpProps) {
  const { data: types, isLoading } = useTypesQuery();

  const {
    watch,
    setError,
    clearErrors,
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm<EducationExperienceType>({
    resolver: zodResolver(educationExperienceSchema),
    defaultValues: {
      user_id: userId,
      Institute: '',
      Position: '',
      referenceNumber: '',
    },
  });

  useEffect(() => {
    if (editingItem) {
      Object.entries(editingItem).forEach(([key, value]) => {
        setValue(key as keyof EducationExperienceType, value);
      });
    } else {
      reset({
        user_id: userId,
        Institute: '',
        Position: '',
        referenceNumber: '',
      });
    }
  }, [editingItem, setValue, reset, userId]);

  const type = watch('type');
  const start = watch('Start_Date');
  const end = watch('End_Date');
  const documentType = watch('documentType');
  const doc = watch('Document');

  const onSubmit = (data: EducationExperienceType) => {
    handleExperienceSubmit(data);
    reset();
    onCloseChange();
  };

  const getPreviewUrl = (fileOrUrl: File | string | null) => {
    if (fileOrUrl instanceof File) {
      return URL.createObjectURL(fileOrUrl);
    }
    return typeof fileOrUrl === 'string' ? fileOrUrl : '';
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        reset();
        onOpenChange();
      }}
    >
      <DialogContent className="min-w-max">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Edit' : 'Add'} Education & Experience
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 pt-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          <div className="flex flex-col">
            <Label htmlFor="type" className="mb-2 text-left">
              Type <span className="text-red-600">*</span>
            </Label>
            <Select
              name="type"
              value={type || 'Select Type'}
              onValueChange={(value: 'education' | 'experience') => {
                if (value === 'education' || value === 'experience') {
                  setValue('type', value);
                }
              }}
            >
              <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue>
                  {type
                    ? type.charAt(0).toUpperCase() + type.slice(1)
                    : 'Select Type'}
                </SelectValue>
                <SelectContent>
                  <SelectGroup className="text-sm">
                    <SelectItem
                      value="education"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Education
                    </SelectItem>
                    <SelectItem
                      value="experience"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Experience
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </SelectTrigger>
            </Select>
            {errors.type && (
              <span className="text-xs text-red-500">
                {errors.type.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Start_Date" className="mb-2 text-left">
              Start Date <span className="text-red-600">*</span>
            </Label>
            <CustomDayPicker
              initialDate={start}
              onDateChange={date => {
                if (date) {
                  setValue('Start_Date', date);
                }
              }}
              disabled={date => date > new Date()}
              className="h-auto"
            />
            {errors.Start_Date && (
              <span className="text-xs text-red-500">
                {errors.Start_Date.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="End_Date" className="mb-2 text-left">
              End Date <span className="text-red-600">*</span>
            </Label>
            <CustomDayPicker
              initialDate={end}
              onDateChange={date => {
                if (date) {
                  setValue('End_Date', date);
                }
              }}
              disabled={date => date > new Date()}
              className="h-auto"
            />
            {errors.End_Date && (
              <span className="text-xs text-red-500">
                {errors.End_Date?.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Institute" className="mb-2 text-left">
              {type === 'education' ? 'Institue' : 'Company'}{' '}
              <span className="text-red-600">*</span>
            </Label>
            <Input
              id="Institute"
              {...register('Institute')}
              placeholder={
                type === 'education' ? 'Enter Institue' : 'Enter Company'
              }
            />
            {errors.Institute && (
              <span className="text-xs text-red-500">
                {errors.Institute.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Position" className="mb-2 text-left">
              {type === 'education' ? 'Department' : 'Position'}{' '}
              <span className="text-red-600">*</span>
            </Label>
            <Input
              id="Position"
              {...register('Position')}
              placeholder={
                type === 'education' ? 'Enter Department' : 'Enter Position'
              }
            />
            {errors.Position && (
              <span className="text-xs text-red-500">
                {errors.Position.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="documentType" className="mb-2 text-left">
              Document Type <span className="text-red-600">*</span>
            </Label>
            <Select
              name="documentType"
              value={type || 'Select Document Type'}
              onValueChange={value => {
                if (value) {
                  setValue('documentType', value);
                }
              }}
            >
              <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue>
                  {documentType ? documentType : 'Select Document Type'}
                </SelectValue>
                <SelectContent>
                  <SelectGroup className="text-sm">
                    {type === 'education'
                      ? types?.educationType.map((edu, i) => (
                          <SelectItem
                            key={i}
                            value={edu}
                            className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                          >
                            {edu}
                          </SelectItem>
                        ))
                      : types?.experienceType.map((exp, i) => (
                          <SelectItem
                            key={i}
                            value={exp}
                            className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                          >
                            {exp}
                          </SelectItem>
                        ))}
                  </SelectGroup>
                </SelectContent>
              </SelectTrigger>
            </Select>
            {errors.documentType && (
              <span className="text-xs text-red-500">
                {errors.documentType.message}
              </span>
            )}
          </div>

          {type === 'experience' && (
            <div className="flex flex-col">
              <Label htmlFor="referenceNumber" className="mb-2 text-left">
                Reference Number
              </Label>
              <Input
                id="referenceNumber"
                {...register('referenceNumber')}
                placeholder="03XXXXXXXXX"
                onBlur={() => {
                  const phone = watch('referenceNumber');
                  const strippedVal = phone?.replace(/^(03|\+923)/, '');
                  const isDigit = /^\d+$/.test(strippedVal || '');
                  if (phone && (strippedVal?.length !== 9 || !isDigit)) {
                    setError('referenceNumber', {
                      type: 'manual',
                      message:
                        'Phone number must have exactly 9 digits after 03 or +923',
                    });
                  } else {
                    clearErrors('referenceNumber');
                  }
                }}
              />
              {errors.referenceNumber && (
                <span className="text-xs text-red-500">
                  {errors.referenceNumber.message}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-left" htmlFor="Document">
                Document <span className="text-red-600">*</span>
              </Label>
              {doc && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Eye
                          className="ml-2 inline cursor-pointer text-primary/80 hover:text-primary"
                          onClick={() =>
                            doc && window.open(getPreviewUrl(doc), '_blank')
                          }
                          size={18}
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Click to Preview Document</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <Input
              id="Document"
              onChange={e => {
                const file = e.target?.files?.[0] || '';
                setValue('Document', file);
              }}
              accept="image/jpeg, image/png, image/jpg, application/pdf"
              type="file"
            />
            {errors?.Document && (
              <span className="text-xs text-red-500">
                {errors.Document.message}
              </span>
            )}
          </div>

          <DialogFooter className="col-span-1 md:col-span-2 lg:col-span-3">
            <Button
              type="button"
              onClick={() => handleSubmit(onSubmit)()}
              disabled={isLoading}
            >
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
