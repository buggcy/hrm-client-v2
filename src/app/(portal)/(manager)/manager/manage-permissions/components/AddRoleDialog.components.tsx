'use client';

import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { toast } from '@/components/ui/use-toast';

import { addRoles } from '@/services/manager/manage-permissions.service';

import { MessageErrorResponse } from '@/types';

const addPermissionSchema = z.object({
  roleId: z.number(),
  roleName: z.string().min(1, 'Role Name is required'),
});

export type AddRoleFormData = z.infer<typeof addPermissionSchema>;

interface AddRolenDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
  refetch?: () => void;
}

export function AddRoleDialog({
  open,
  onOpenChange,
  onCloseChange,
  refetch,
}: AddRolenDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddRoleFormData>({
    resolver: zodResolver(addPermissionSchema),
    defaultValues: {
      roleId: 0,
      roleName: '',
    },
  });

  const { mutate: addRole, isPending: isAdding } = useMutation({
    mutationFn: addRoles,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on adding role!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      reset();
      onCloseChange();
      refetch && refetch();
    },
  });

  const onSubmit = (formData: AddRoleFormData) => {
    addRole({
      roleId: formData.roleId,
      roleName: formData.roleName,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange();
        reset();
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 py-0">
          <div className="grid grid-cols-1 gap-8">
            <div className="flex flex-col">
              <Label htmlFor="roleId" className="mb-2 text-left">
                Role Id
              </Label>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="roleId"
                    placeholder="Enter Role ID"
                    type="number"
                  />
                )}
              />
              {errors.roleId && (
                <span className="text-sm text-red-500">
                  {errors.roleId.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="roleName" className="mb-2 text-left">
                Role Name
              </Label>
              <Controller
                name="roleName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="roleName"
                    placeholder="Enter Permission Name"
                    type="text"
                  />
                )}
              />
              {errors.roleName && (
                <span className="mt-4 text-sm text-red-500">
                  {errors.roleName.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <DialogFooter>
              <Button type="submit" disabled={isAdding}>
                Add
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
