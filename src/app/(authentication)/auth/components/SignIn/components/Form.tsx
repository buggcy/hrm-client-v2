'use client';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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
import { toast } from '@/components/ui/use-toast';

import { PasswordInput } from '@/app/(authentication)/auth/components/PasswordInput';
import { signInWithEmailAndPassword } from '@/services';

const FormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Please enter a password with at least 8 characters.',
  }),
});

export function SignInForm() {
  const { mutate, isPending } = useMutation({
    mutationFn: signInWithEmailAndPassword,
    onError: () => {
      toast({
        // TODO: show correct error message
        title:
          'Sign-in unsuccessful. Please verify your username and password. If the issue persists, try resetting your password or contact our support team at support@example.com for assistance.',
        variant: 'destructive',
      });
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(data);
  }

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
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
