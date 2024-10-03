'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingButton } from '@/components/LoadingButton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

import { useRedirectAfterAuth } from '@/app/(authentication)/auth/hooks';
import { sendDataForResetPassword } from '@/services';

import { PasswordInput } from '../../sign-in/components/PasswordInput';

const FormSchema = z
  .object({
    email: z
      .string()
      .email({
        message: 'Please enter a valid email address.',
      })
      .nonempty({ message: 'Email is required.' }),
    otp: z
      .string()
      .nonempty({ message: 'OTP is required.' })
      .length(6, { message: 'OTP must be 6 characters long.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(25, { message: 'Password must be at most 25 characters long.' })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter.',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter.',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
      .regex(/[\W_]/, {
        message: 'Password must contain at least one special character.',
      })
      .nonempty({ message: 'Password is required.' }),
    cPassword: z
      .string()
      .nonempty({ message: 'Confirm Password is required.' }),
  })
  .refine(data => data.password === data.cPassword, {
    message: "Passwords don't match",
    path: ['cPassword'],
  });

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutate, isPending } = useMutation({
    mutationFn: sendDataForResetPassword,
    onError: () => {
      toast({
        title: 'Error',
        description: 'Error on reseting password!',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Password reset successfully!',
      });
      router.push(`/auth/sign-in`);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      password: '',
      otp: '',
      cPassword: '',
    },
  });

  useRedirectAfterAuth();

  const onSubmit = (data: z.infer<typeof FormSchema>) => mutate(data);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <Input autoComplete="otp" placeholder="Enter OTP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="current-password"
                  placeholder="Enter password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="current-password"
                  placeholder="Enter confirm password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          className="w-full"
          type="submit"
          disabled={isPending}
          loading={isPending}
        >
          Request Password Reset
        </LoadingButton>
      </form>
    </Form>
  );
}
