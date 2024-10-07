'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import { useStores } from '@/providers/Store.Provider';

import { createHandleAuthError } from '@/app/(authentication)/auth/hooks';
import { PasswordInput } from '@/app/(authentication)/auth/sign-in/components/PasswordInput';
import { signInWithEmailAndPassword } from '@/services';
import { AuthStoreType } from '@/stores/auth';

interface AuthResponse {
  token: string;
}

const FormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Please enter a password with at least 8 characters.',
  }),
});

export function SignInForm() {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { setUser } = authStore;

  const searchParams = useSearchParams();
  const { mutate, isPending } = useMutation({
    mutationFn: signInWithEmailAndPassword,
    onError: createHandleAuthError({
      title:
        'An error occurred while signing in. Please check your email and password and try again.',
      description:
        ' If the issue persists, try resetting your password or contact our support team for assistance.',
    }),
    onSuccess: (response: AuthResponse) => {
      Cookies.set('hrmsToken', response?.token, { expires: 1 });
      setUser(response?.token);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
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
                  autoComplete="current-password"
                  placeholder="Enter password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                <Button asChild variant="link" className="p-0">
                  <Link href="/auth/forgot-password">
                    Forgot your password?
                  </Link>
                </Button>
              </FormDescription>
            </FormItem>
          )}
        />
        <FormMessage />
        <Button className="w-full" type="submit" disabled={isPending}>
          Sign In {isPending && '...'}
        </Button>
      </form>
    </Form>
  );
}
