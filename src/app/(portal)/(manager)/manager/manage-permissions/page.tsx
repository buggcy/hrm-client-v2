'use client';

import React, { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Bell } from 'lucide-react';

import Header from '@/components/Header/Header';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

import {
  usePagePermissionsQuery,
  usePermissionsQuery,
} from '@/hooks/manager/usePermissions.hook';
import { ManagerRolePermissionsApiResponse } from '@/libs/validations/manager-role-permissions';
import { changeRolePermission } from '@/services/manager/manage-permissions.service';

import { AddPermissionDialog } from './components/AddPermissionDialog.components';
import UserPermissionsTab from './components/UserPermissionsTab.component';

import { MessageErrorResponse } from '@/types';

function formatCamelCase(text: string) {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before each uppercase letter
    .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
}

const Page = () => {
  const [addModelOpen, setAddModelOpen] = useState(false);
  const [dialogData, setDialogData] = useState<
    { roleId: number; roleName: string }[] | undefined
  >();
  const [rolePermissions, setRolePermissions] =
    useState<ManagerRolePermissionsApiResponse>();
  const [pagePermissions, setPagePermissions] =
    useState<ManagerRolePermissionsApiResponse>();

  const handleAddModelOpen = () => setAddModelOpen(true);
  const handleAddModelClose = () => setAddModelOpen(false);
  const { data, isPending, refetch } = usePermissionsQuery();
  const {
    data: pagePermissionsData,
    isPending: isPagePending,
    refetch: refetchPagePermissions,
  } = usePagePermissionsQuery();
  const { mutate: updatePermission, isPending: isUpdating } = useMutation({
    mutationFn: changeRolePermission,
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
      void refetchPagePermissions();
    },
  });
  const handleCheckChange = (
    roleId: number,
    name: string,
    allowed: boolean,
  ) => {
    updatePermission({ roleId, name, allowed });
  };
  useEffect(() => {
    if (rolePermissions) {
      setDialogData(() =>
        rolePermissions.data.map(role => ({
          roleId: role.roleId,
          roleName: role.roleName,
        })),
      );
    }
  }, [rolePermissions]);

  useEffect(() => {
    if (data) {
      setRolePermissions(data);
    }
  }, [data]);

  useEffect(() => {
    if (pagePermissionsData) {
      setPagePermissions(pagePermissionsData);
    }
  }, [pagePermissionsData]);
  return (
    <Layout>
      <LayoutHeader title="Manage Permissions">
        <LayoutHeaderButtonsBlock>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="size-5" />
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <Header subheading="Guiding our team with clarity and respect.">
          <Button variant="default" onClick={handleAddModelOpen}>
            Add Permission
          </Button>
        </Header>
        <Tabs defaultValue="page">
          <TabsList className="flex size-full flex-col sm:flex-row">
            <TabsTrigger value="page" className="w-full">
              Page Permissions
            </TabsTrigger>
            <TabsTrigger value="role" className="w-full">
              Role Permissions
            </TabsTrigger>
            <TabsTrigger value="user" className="w-full">
              User Permissions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="page">
            <div className="size-full">
              <Tabs
                className="flex size-full flex-col gap-4 md:flex-row"
                defaultValue={
                  pagePermissions?.data[0]._id || pagePermissions?.data[0]._id
                }
              >
                <TabsList className="flex h-full flex-col py-4">
                  {pagePermissions?.data.map(role => (
                    <TabsTrigger
                      key={role._id}
                      value={role._id}
                      className="mx-12 flex w-full justify-start py-2 text-left capitalize md:w-full"
                    >
                      {role.roleName}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="w-full">
                  {pagePermissions?.data?.map(role => (
                    <TabsContent
                      key={role._id}
                      value={role._id}
                      className="size-full max-h-[500px] overflow-y-auto"
                    >
                      <Table className="max-h-[500px] w-full overflow-y-auto">
                        <TableHead className="w-full">
                          <TableRow className="flex flex-row justify-between">
                            <TableHeader className="w-1/2">
                              Permission
                            </TableHeader>
                            <TableHeader className="-mr-20 w-1/2 text-right">
                              Allowed
                            </TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody className="max-h-[500px] overflow-y-auto">
                          {role.permissions.map(permission => (
                            <TableRow key={permission._id}>
                              <TableCell>
                                {formatCamelCase(permission.name)}
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={permission.allowed}
                                  onCheckedChange={checked => {
                                    handleCheckChange(
                                      role.roleId,
                                      permission.name,
                                      checked,
                                    );
                                  }}
                                  disabled={
                                    isPending || isUpdating || isPagePending
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          </TabsContent>
          <TabsContent value="role">
            <div className="size-full">
              <Tabs
                className="flex size-full flex-col gap-4 md:flex-row"
                defaultValue={rolePermissions?.data[0]._id || data?.data[0]._id}
              >
                <TabsList className="flex h-full flex-col py-4">
                  {rolePermissions?.data.map(role => (
                    <TabsTrigger
                      key={role._id}
                      value={role._id}
                      className="mx-12 flex w-full justify-start py-2 text-left capitalize md:w-full"
                    >
                      {role.roleName}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="w-full">
                  {rolePermissions?.data?.map(role => (
                    <TabsContent
                      key={role._id}
                      value={role._id}
                      className="size-full max-h-[500px] overflow-y-auto"
                    >
                      <Table className="max-h-[500px] w-full overflow-y-auto">
                        <TableHead className="w-full">
                          <TableRow className="flex flex-row justify-between">
                            <TableHeader className="w-1/2">
                              Permission
                            </TableHeader>
                            <TableHeader className="-mr-20 w-1/2 text-right">
                              Allowed
                            </TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody className="max-h-[500px] overflow-y-auto">
                          {role.permissions.map(permission => (
                            <TableRow key={permission._id}>
                              <TableCell>
                                {formatCamelCase(permission.name)}
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={permission.allowed}
                                  onCheckedChange={checked => {
                                    handleCheckChange(
                                      role.roleId,
                                      permission.name,
                                      checked,
                                    );
                                  }}
                                  disabled={
                                    isPending || isUpdating || isPagePending
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          </TabsContent>
          <TabsContent value="user">
            <UserPermissionsTab />
          </TabsContent>
        </Tabs>
      </LayoutWrapper>
      <AddPermissionDialog
        open={addModelOpen}
        onOpenChange={handleAddModelClose}
        onCloseChange={handleAddModelClose}
        data={rolePermissions?.data ? dialogData : []}
        refetch={() => {
          void refetch();
          void refetchPagePermissions();
        }}
      />
    </Layout>
  );
};

export default Page;
