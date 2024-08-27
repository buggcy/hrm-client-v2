'use client';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { sendGTMEvent } from '@next/third-parties/google';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingButton } from '@/components/LoadingButton';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

import { PasswordInput } from '@/app/(authentication)/auth/sign-in/components/PasswordInput';
import { SupportButton } from '@/app/(portal)/components/Navigation/components/SupportButton';
import { signUpWithEmailAndPassword } from '@/services';

const FormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password cannot exceed 64 characters')
    .regex(/^\S+$/, 'Password cannot contain whitespace')
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character',
    ),
  firstName: z.string().min(1, {
    message: 'Please enter your first name.',
  }),
  lastName: z.string().min(1, {
    message: 'Please enter your last name.',
  }),
});

export function SignUpForm() {
  const searchParams = useSearchParams();
  const { mutate, isPending } = useMutation({
    mutationFn: signUpWithEmailAndPassword,
    onSuccess: () => {
      sendGTMEvent({
        event: 'signup',
        method: 'email',
      });
    },
    onError: error => {
      toast({
        title: 'An error occurred while signing up.',
        description: error.message || undefined,
        action: <SupportButton />,
        variant: 'error',
      });
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: searchParams.get('email') ?? '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    autoComplete="given-name"
                    placeholder="Enter first name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    autoComplete="family-name"
                    placeholder="Enter last name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Enter password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormDescription>
          By creating an account, I acknowledge the Privacy Policy and agree to
          the Self Serve Services Agreement
        </FormDescription>
        <FormMessage />
        <LoadingButton
          className="w-full"
          type="submit"
          disabled={isPending}
          loading={isPending}
        >
          Sign Up
        </LoadingButton>
      </form>
    </Form>
  );
}
