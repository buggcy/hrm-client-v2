'use client';

import React, { useState } from 'react';

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
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

import { addPermission } from '@/services/manager/manage-permissions.service';

import { MessageErrorResponse } from '@/types';

const addPermissionSchema = z.object({
  permissionName: z.string(),
});

export type AddPermissionFormData = z.infer<typeof addPermissionSchema>;

interface AddPermissionDialogProps {
  data?: {
    roleId: number;
    roleName: string;
  }[];
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
  refetch?: () => void;
}
const today = new Date();
today.setHours(0, 0, 0, 0);

export function AddPermissionDialog({
  data,
  open,
  onOpenChange,
  onCloseChange,
  refetch,
}: AddPermissionDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddPermissionFormData>({
    resolver: zodResolver(addPermissionSchema),
    defaultValues: {
      permissionName: '',
    },
  });
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  const { mutate: addPermissionData, isPending: isAdding } = useMutation({
    mutationFn: addPermission,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on adding permission!',
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

  const onSubmit = (formData: AddPermissionFormData) => {
    addPermissionData({
      name: formData.permissionName,
      roleIds: selectedRoleIds,
    });
  };

  const handleCheckChange = (roleId: number, allowed: boolean) => {
    if (allowed) {
      setSelectedRoleIds(prev => [...prev, roleId]);
    } else {
      setSelectedRoleIds(prev => prev.filter(id => id !== roleId));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Permission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 py-0">
          <div className="grid grid-cols-1 gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="permissionName" className="mb-2 text-left">
                Permission Name
              </Label>
              <Controller
                name="permissionName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="permissionName"
                    placeholder="Enter Permission Name"
                    type="text"
                  />
                )}
              />
              {errors.permissionName && (
                <span className="text-sm text-red-500">
                  {errors.permissionName.message}
                </span>
              )}
            </div>
            <div className="flex flex-row flex-wrap gap-4">
              {data?.map((role, index) => (
                <div key={index} className="flex flex-row items-center gap-2">
                  <Label
                    htmlFor={`role-${role.roleId}`}
                    className="text-left capitalize"
                  >
                    {role.roleName}
                  </Label>
                  <Switch
                    id={`role-${role.roleId}`}
                    name={`role-${role.roleId}`}
                    onCheckedChange={checked =>
                      handleCheckChange(role.roleId, checked)
                    }
                  />
                </div>
              ))}
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
