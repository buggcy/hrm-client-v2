'use client';
import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Eye } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';

import { ComplaintListType } from '@/libs/validations/complaint';
import {
  registerComplaint,
  updateComplaint,
} from '@/services/employee/complaint.service';

import { MessageErrorResponse } from '@/types';

interface ModalProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  type: string;
  userId?: string;
  setRefetchComplaintList: (refetch: boolean) => void;
  selectedRow?: ComplaintListType | null;
}

const FormSchema = z.object({
  title: z.string().min(1, 'Complaint Title is required'),
  complaint: z.string().min(1, 'Complaint Message is required'),
  proofDocument: z
    .instanceof(File)
    .nullable()
    .optional()
    .refine(
      file =>
        !file ||
        [
          'image/png',
          'image/jpg',
          'image/jpeg',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ].includes(file.type),
      {
        message:
          'Accepted file types are png, jpg, jpeg, pdf, doc, docx, xls, xlsx',
      },
    )
    .refine(file => !file || file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    }),
});

export type ComplaintFormData = z.infer<typeof FormSchema>;
export function AddEditComplaintModal({
  open,
  onCloseChange,
  type,
  userId,
  setRefetchComplaintList,
  selectedRow,
}: ModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      complaint: '',
    },
  });

  useEffect(() => {
    if (type === 'edit' && selectedRow) {
      reset({
        title: selectedRow.title || '',
        complaint: selectedRow.complaint || '',
      });
    }
  }, [selectedRow, type, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: registerComplaint,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Complaint Register Successfully!',
        variant: 'success',
      });
      reset();
      setRefetchComplaintList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message ||
          'Error on resgistering the complaint!',
        variant: 'error',
      });
    },
  });
  const { mutate: EditMutate, isPending: EditPending } = useMutation({
    mutationFn: updateComplaint,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Complaint Update Successfully!',
        variant: 'success',
      });
      reset();
      setRefetchComplaintList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on updating the complaint!',
        variant: 'error',
      });
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: ComplaintFormData) => {
    if (type === 'add') {
      const formData = new FormData();
      formData.append('userId', userId || '');
      formData.append('title', data.title);
      formData.append('complaint', data.complaint);
      if (data.proofDocument) {
        formData.append('proofDocument', data.proofDocument);
      }
      mutate(formData);
    }
    if (type === 'edit') {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('complaint', data.complaint);
      if (data.proofDocument) {
        formData.append('proofDocument', data.proofDocument);
      }
      const payload = {
        id: selectedRow?._id || '',
        formData,
      };
      EditMutate(payload);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {type === 'add' ? 'Register Complaint' : 'Update Complaint'}
            </DialogTitle>
          </DialogHeader>
          <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap">
              <div className="flex flex-1 flex-col">
                <Label htmlFor="title" className="mb-2 text-left">
                  Complaint Title <span className="text-red-600">*</span>
                </Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="title"
                      placeholder="Please Enter Complaint Title"
                      {...field}
                    />
                  )}
                />
                {errors.title && (
                  <span className="text-sm text-red-500">
                    {errors.title.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="flex flex-1 flex-col">
                <Label htmlFor="complaint" className="mb-2 text-left">
                  Complaint Message <span className="text-red-600">*</span>
                </Label>
                <Controller
                  name="complaint"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="complaint"
                      placeholder="write your complaint..."
                      {...field}
                    />
                  )}
                />
                {errors.complaint && (
                  <span className="text-sm text-red-500">
                    {errors.complaint.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="proofDocument" className="mb-2 text-left">
                Choose Document{' '}
                {type === 'edit' && selectedRow?.document && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Eye
                            className="ml-2 inline cursor-pointer text-primary/80 hover:text-primary"
                            onClick={() =>
                              selectedRow?.document &&
                              window.open(
                                String(selectedRow?.document),
                                '_blank',
                              )
                            }
                            size={18}
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Click to Preview Document</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </Label>

              <Controller
                name="proofDocument"
                control={control}
                render={({ field }) => (
                  <Input
                    id="proofDocument"
                    placeholder="Choose a file"
                    type="file"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                )}
              />
              {errors.proofDocument && (
                <span className="text-sm text-red-500">
                  {errors.proofDocument.message}
                </span>
              )}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={type === 'add' ? isPending : EditPending}
                size={'sm'}
              >
                {type === 'add' ? 'Register' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
