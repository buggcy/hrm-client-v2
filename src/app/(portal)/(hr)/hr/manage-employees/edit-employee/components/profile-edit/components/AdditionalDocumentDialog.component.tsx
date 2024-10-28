import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdditionalDocumentDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onSubmit: (data: additionalDocumentFormData) => void;
}

const additionalDocumentSchema = z.object({
  document: z
    .instanceof(File)
    .nullable()
    .refine(file => file === null || file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    }),
});

export type additionalDocumentFormData = z.infer<
  typeof additionalDocumentSchema
>;

const AdditionalDocumentDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: AdditionalDocumentDialogProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<additionalDocumentFormData>({
    resolver: zodResolver(additionalDocumentSchema),
    defaultValues: {
      document: null,
    },
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Additional Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col">
            <Label htmlFor="document" className="mb-2 text-left">
              Choose Document
            </Label>
            <Controller
              name="document"
              control={control}
              render={({ field }) => (
                <Input
                  id="document"
                  placeholder="Choose a file"
                  type="file"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                  }}
                />
              )}
            />
            {errors.document && (
              <span className="text-sm text-red-500">
                {errors.document.message}
              </span>
            )}
          </div>
          <Button type="submit">Add</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdditionalDocumentDialog;
