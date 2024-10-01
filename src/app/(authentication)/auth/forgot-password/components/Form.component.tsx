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
import { sendPasswordResetEmail } from '@/services';

const FormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: sendPasswordResetEmail,
    onError: err => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on sending mail!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      router.push(`/auth/reset-password/${form.getValues('email')}`);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  });

  useRedirectAfterAuth();

  const onSubmit = (data: z.infer<typeof FormSchema>) => mutate(data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="work email"
                  placeholder="Enter email"
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
