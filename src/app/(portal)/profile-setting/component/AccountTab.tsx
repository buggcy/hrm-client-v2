'use client';
import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

import { useTypesQuery } from '@/hooks/types.hook';
import { ChangePassword } from '@/services/hr/employee.service';

import { MessageErrorResponse } from '@/types';
import { User } from '@/types/user.types';
interface UserProps {
  user: User;
}

const FormSchema = z
  .object({
    oldPassword: z.string().min(1, 'Old Password is required'),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(64, { message: 'Password cannot exceed 64 characters' })
      .regex(/^\S+$/, 'Password cannot contain whitespace')
      .refine(value => /[A-Z]/.test(value), {
        message: 'Password must contain at least 1 uppercase letter',
      })
      .refine(value => /[a-z]/.test(value), {
        message: 'Password must contain at least 1 lowercase letter',
      })
      .refine(value => /\d/.test(value), {
        message: 'Password must contain at least 1 digit',
      })
      .refine(value => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value), {
        message: 'Password must contain at least 1 special character',
      }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(64, { message: 'Password cannot exceed 64 characters' })
      .regex(/^\S+$/, 'Password cannot contain whitespace')
      .refine(value => /[A-Z]/.test(value), {
        message: 'Password must contain at least 1 uppercase letter',
      })
      .refine(value => /[a-z]/.test(value), {
        message: 'Password must contain at least 1 lowercase letter',
      })
      .refine(value => /\d/.test(value), {
        message: 'Password must contain at least 1 digit',
      })
      .refine(value => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value), {
        message: 'Password must contain at least 1 special character',
      }),
  })
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

export type ChangePasswordFormData = z.infer<typeof FormSchema>;

const AccountTab: React.FC<UserProps> = ({ user }) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isLoading } = useTypesQuery();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ChangePassword,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on Changing Password!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Password has been Changed!',
        variant: 'success',
      });
      reset();
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    const payload = {
      id: user.id,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    mutate(payload);
  };

  return (
    <>
      <div className="mb-2 mt-4 text-base font-normal dark:text-white">
        Change Password
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 grid grid-cols-12 gap-4">
          <Label
            htmlFor="oldPassword"
            className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
          >
            <span className="text-red-500">*</span> Old Password
          </Label>
          <div className="col-span-12 md:col-span-8 lg:col-span-8">
            <div className="relative">
              <Controller
                name="oldPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    type={showOldPassword ? 'text' : 'password'}
                    id="oldPassword"
                    placeholder="Enter old password..."
                    className="pr-10"
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-13"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <Eye className="size-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <EyeOff className="size-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <span className="text-sm text-red-500">
                {errors.oldPassword.message}
              </span>
            )}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-12 gap-4">
          <Label
            htmlFor="newPassword"
            className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
          >
            <span className="text-red-500">*</span> New Password
          </Label>
          <div className="col-span-12 md:col-span-8 lg:col-span-8">
            <div className="relative">
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    placeholder="Enter new password..."
                    className="pr-10"
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-13"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <Eye className="size-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <EyeOff className="size-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <span className="text-sm text-red-500">
                {errors.newPassword.message}
              </span>
            )}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-12 gap-4">
          <Label
            htmlFor="confirmPassword"
            className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
          >
            <span className="text-red-500">*</span> Confirm New Password
          </Label>
          <div className="col-span-12 md:col-span-8 lg:col-span-8">
            <div className="relative">
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder="Confirm new password..."
                    className="pr-10"
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-13"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <Eye className="size-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <EyeOff className="size-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button size={'sm'} type="submit" disabled={isLoading || isPending}>
            Change Password {isPending && '...'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default AccountTab;
