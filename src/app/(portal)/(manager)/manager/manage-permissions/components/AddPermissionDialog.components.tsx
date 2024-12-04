'use client';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ChevronDown } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

import { addPermission } from '@/services/manager/manage-permissions.service';

import { MessageErrorResponse } from '@/types';

const addPermissionSchema = z.object({
  permissionType: z.enum(['access', 'canRead', 'canWrite']),
  permissionName: z.string().min(1, 'Permission Name is required'),
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
    watch,
  } = useForm<AddPermissionFormData>({
    resolver: zodResolver(addPermissionSchema),
    defaultValues: {
      permissionType: 'access',
      permissionName: '',
    },
  });
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [permission, setPermission] = useState<string>();

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

  const permissionType = watch('permissionType');
  const permissionName = watch('permissionName');

  useEffect(() => {
    if (permissionName) {
      const name = permissionName
        .toLowerCase()
        .split(' ')
        .map((word, index) =>
          index === 0
            ? word.charAt(0).toUpperCase() + word.slice(1)
            : word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join('');
      setPermission(`${permissionType}${name}`);
    } else {
      setPermission(`${permissionType}`);
    }
  }, [permissionName, permissionType]);

  const onSubmit = (formData: AddPermissionFormData) => {
    const name = formData.permissionName
      .toLowerCase()
      .split(' ')
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toUpperCase() + word.slice(1)
          : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join('');

    const permissionFullName = `${formData.permissionType}${name}`;
    addPermissionData({
      name: permissionFullName,
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
            <div className="flex flex-col">
              <Label htmlFor="permissionType" className="mb-2 text-left">
                Leave Type
              </Label>
              <Controller
                name="permissionType"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative z-50 w-full rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select Permission Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="N" disabled>
                          Select Permission Type
                        </SelectItem>
                        <SelectItem value="access">Access</SelectItem>
                        <SelectItem value="canRead">Read</SelectItem>
                        <SelectItem value="canWrite">Write</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                    <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                  </Select>
                )}
              />
              {errors.permissionType && (
                <span className="text-sm text-red-500">
                  {errors.permissionType.message}
                </span>
              )}
            </div>
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
                <span className="mt-4 text-sm text-red-500">
                  {errors.permissionName.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label className="mb-2 text-left">
                Permission:{' '}
                <span
                  className={`${permissionName ? 'text-success' : 'text-error'}`}
                >
                  {permission}
                </span>
              </Label>
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
