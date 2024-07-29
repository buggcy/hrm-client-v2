'use client';

import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
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

import { useCopyToClipboard } from '@/hooks';
import { useCreateApiKeyMutation } from '@/hooks/useApiKeys';
import { queryClient } from '@/libs';

// function isValidIpAddress(ipAddress: string) {
//   const ipPattern =
//     /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
//   return ipPattern.test(ipAddress);
// }

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required and should be at least 1 character.',
  }),
  // ips: z
  //   .string({
  //     message: 'Invalid IP address',
  //   })
  //   .optional()
  //   .refine(value => {
  //     if (!value) {
  //       return true;
  //     }
  //     const ips = value.split(',').map(ip => ip.trim());
  //     return ips.every(isValidIpAddress);
  //   }),
});

type formSchemaType = z.infer<typeof formSchema>;

export function CreateApiKeyDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [apiKey, setApiKey] = useState('');
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    textToCopy: apiKey,
  });

  const { mutate: createApiKey, isPending } = useCreateApiKeyMutation({
    onSuccess: data => {
      setApiKey(data['api-key']);
      void queryClient.refetchQueries({ queryKey: ['api-keys'] });
    },
    onError: () => {
      toast({
        title: 'Failed to create API key',
        variant: 'error',
      });
    },
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      // ips: '',
    },
  });

  const onSubmit = (data: formSchemaType) => {
    createApiKey({
      name: data.name,
      ips: [],
      // data.ips
      //   ?.split(',')
      //   .map(ip => ip.trim())
      //   .filter(Boolean) ?? [],
    });
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    form.reset();
    setApiKey('');
  };

  const handleClose = () => {
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!apiKey ? (
        <DialogContent>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            All API keys generated here can access Tavus.io&apos;s services.
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Test Key" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="ips"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Whitelisted IPs</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="You can add multiple IP addresses separated by a comma."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <LoadingButton
                className="ml-auto"
                type="submit"
                disabled={isPending}
                loading={isPending}
              >
                Create API Key
              </LoadingButton>
            </form>
          </Form>
        </DialogContent>
      ) : (
        <DialogContent className="gap-6">
          <DialogTitle>Save your key</DialogTitle>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Input value={apiKey} readOnly />
              <Button onClick={copyToClipboard}>
                {isCopied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}{' '}
                Copy
              </Button>
            </div>
            <DialogDescription>
              Make sure to save this secret key in a safe place — you won&apos;t
              be able to see it again through your account. If you lose it,
              you&apos;ll need to create a new one.
            </DialogDescription>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
