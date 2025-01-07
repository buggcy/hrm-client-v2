'use client';
import React, { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';

import { useUserPermissionsQuery } from '@/hooks/manager/usePermissions.hook';
import { UserPermission } from '@/libs/validations/manager-role-permissions';
import { updateUserPermission } from '@/services/manager/manage-permissions.service';

import { MessageErrorResponse } from '@/types';

function formatCamelCase(text: string) {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}

const UserPermissionsTab = () => {
  const { data, isPending, refetch } = useUserPermissionsQuery();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedEmployeeData, setSelectedEmployeeData] =
    useState<UserPermission>();

  const handleEmployeeChange = (value: string) => {
    setSelectedEmployee(value);
    setSelectedEmployeeData(
      data?.data.find(userPermission => userPermission._id === value),
    );
  };

  const { mutate: updateUserPermissionData, isPending: isUpdating } =
    useMutation({
      mutationFn: updateUserPermission,
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description:
            err?.response?.data?.message || 'Error on adding announcement!',
          variant: 'error',
        });
      },
      onSuccess: response => {
        toast({
          title: 'Success',
          description: response?.message,
          variant: 'success',
        });
        void refetch();
      },
    });

  const handleCheckChange = (
    userId: string,
    name: string,
    allowed: boolean,
  ) => {
    setSelectedEmployeeData(prevData => {
      if (!prevData) return prevData;

      return {
        ...prevData,
        permissions: prevData.permissions.map(permission =>
          permission.name === name
            ? { ...permission, allowed: !allowed }
            : permission,
        ),
      };
    });

    updateUserPermissionData(
      { userId, name, allowed },
      {
        onError: () => {
          setSelectedEmployeeData(prevData => {
            if (!prevData) return prevData;

            return {
              ...prevData,
              permissions: prevData.permissions.map(permission =>
                permission.name === name
                  ? { ...permission, allowed }
                  : permission,
              ),
            };
          });
        },
        onSettled: () => {
          void refetch();
        },
      },
    );
  };

  useEffect(() => {
    if (data && selectedEmployee) {
      const employeeData = data.data.find(
        user => user._id === selectedEmployee,
      );
      setSelectedEmployeeData(employeeData);
    }
  }, [data, selectedEmployee]);
  return (
    <div className="size-full">
      <div>
        <Select onValueChange={handleEmployeeChange}>
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 md:max-w-[64%]">
            <SelectTrigger className="h-[50px] w-full p-4">
              {selectedEmployee ? (
                <div className="flex items-center gap-1 sm:gap-4">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={selectedEmployeeData?.userId?.Avatar || ''}
                      alt={`${selectedEmployeeData?.userId?.Avatar}`}
                    />
                    <AvatarFallback className="uppercase">
                      {selectedEmployeeData?.userId?.firstName.charAt(0)}
                      {selectedEmployeeData?.userId?.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <SelectValue>
                      <p className="text-sm">
                        {selectedEmployeeData?.userId?.firstName}{' '}
                        {selectedEmployeeData?.userId?.lastName}
                      </p>
                    </SelectValue>
                    <p className="text-xs text-muted-foreground">
                      {selectedEmployeeData?.userId?.companyEmail}
                    </p>
                  </div>
                </div>
              ) : (
                <SelectValue placeholder="Select User" />
              )}
            </SelectTrigger>
            <div className="hidden h-0 w-full opacity-0 sm:block"></div>
            <div className="hidden h-0 w-full opacity-0 sm:block"></div>
          </div>
          <SelectContent className="w-fit">
            <SelectGroup>
              <SelectLabel>Select Employee</SelectLabel>
              {data?.data.map(employee => (
                <SelectItem key={employee._id} value={employee._id}>
                  <div className="flex items-center gap-1 sm:gap-4">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={employee?.userId?.Avatar || ''}
                        alt={`${employee?.userId?.Avatar}`}
                      />
                      <AvatarFallback className="uppercase">
                        {employee.userId?.firstName.charAt(0)}
                        {employee.userId?.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start">
                      <p className="text-sm">
                        {employee.userId?.firstName} {employee.userId?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {employee?.userId?.companyEmail}
                      </p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {selectedEmployee && selectedEmployeeData && (
          <>
            <Table className="max-h-[500px] w-full overflow-y-auto">
              <TableHead className="w-full">
                <TableRow className="flex flex-row justify-between">
                  <TableHeader className="w-1/2">Page</TableHeader>
                  <TableHeader className="-mr-20 w-1/2 text-right">
                    Access
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody className="max-h-[500px] overflow-y-auto">
                {selectedEmployeeData.permissions.map(
                  permission =>
                    permission.name.startsWith('access') && (
                      <TableRow key={permission._id}>
                        <TableCell>
                          {formatCamelCase(permission.name).slice(7)}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={permission.allowed}
                            onCheckedChange={checked => {
                              handleCheckChange(
                                selectedEmployeeData.userId?._id || '',
                                permission.name,
                                checked,
                              );
                            }}
                            disabled={isPending || isUpdating}
                          />
                        </TableCell>
                      </TableRow>
                    ),
                )}
              </TableBody>
            </Table>
            <Table className="max-h-[500px] w-full overflow-y-auto">
              <TableHead className="w-full">
                <TableRow className="flex flex-row justify-between">
                  <TableHeader className="w-1/2">Permission</TableHeader>
                  <TableHeader className="-mr-20 w-1/2 text-right">
                    Allowed
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody className="max-h-[500px] overflow-y-auto">
                {selectedEmployeeData.permissions.map(
                  permission =>
                    permission.name.startsWith('can') && (
                      <TableRow key={permission._id}>
                        <TableCell>
                          {formatCamelCase(permission.name).slice(4)}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={permission.allowed}
                            onCheckedChange={checked => {
                              handleCheckChange(
                                selectedEmployeeData.userId?._id || '',
                                permission.name,
                                checked,
                              );
                            }}
                            disabled={isPending || isUpdating}
                          />
                        </TableCell>
                      </TableRow>
                    ),
                )}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPermissionsTab;
