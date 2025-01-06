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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

import {
  usePagePermissionsQuery,
  usePermissionsQuery,
} from '@/hooks/manager/usePermissions.hook';
import {
  CategorizedPermissionsRole,
  ManagerRolePermissionsApiResponse,
} from '@/libs/validations/manager-role-permissions';
import { changeRolePermission } from '@/services/manager/manage-permissions.service';

import { AddPermissionDialog } from './components/AddPermissionDialog.components';
import { AddRoleDialog } from './components/AddRoleDialog.components';
import PagePermissionsTab from './components/PagePermissionsTab.component';
import RolePermissionsTab from './components/RolePermissionsTab.component';
import UserPermissionsTab from './components/UserPermissionsTab.component';

import { MessageErrorResponse } from '@/types';

function categorizeRolePermissions(
  permissions?: ManagerRolePermissionsApiResponse,
) {
  if (!permissions || !permissions.data) return { data: [] };

  const categorizedData: CategorizedPermissionsRole = {
    ...permissions,
    data: permissions.data.map(role => ({
      ...role,
      permissions: Object.entries(
        role.permissions.reduce<
          Record<string, { read: boolean; write: boolean }>
        >((acc, permission) => {
          const match = permission.name.match(
            /can(Read|Write)([A-Z][a-zA-Z]+)$/,
          );
          if (match) {
            const action = match[1].toLowerCase();
            const category = match[2];
            if (!acc[category]) {
              acc[category] = { read: false, write: false };
            }

            acc[category][action as 'read' | 'write'] = permission.allowed;
          }
          return acc;
        }, {}),
      ).map(([category, actions]) => ({
        category,
        ...actions,
      })),
    })),
  };

  return categorizedData;
}

const Page = () => {
  const [addModelOpen, setAddModelOpen] = useState(false);
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [dialogData, setDialogData] = useState<
    { roleId: number; roleName: string }[] | undefined
  >();
  const [rolePermissions, setRolePermissions] =
    useState<CategorizedPermissionsRole>();
  const [pagePermissions, setPagePermissions] =
    useState<ManagerRolePermissionsApiResponse>();

  const handleAddModelOpen = () => setAddModelOpen(true);
  const handleAddModelClose = () => setAddModelOpen(false);
  const handleAddRoleOpen = () => setAddRoleOpen(true);
  const handleAddRoleClose = () => setAddRoleOpen(false);
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
    action?: 'Read' | 'Write',
  ) => {
    const nameAction = action ? `can${action}${name}` : name;
    updatePermission({ roleId, name: nameAction, allowed });
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
      const categorizedData = categorizeRolePermissions(data);
      setRolePermissions(categorizedData);
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
          <Button variant="default" onClick={handleAddRoleOpen}>
            Add Role
          </Button>
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
            <PagePermissionsTab
              pagePermissions={pagePermissions}
              data={data}
              handleCheckChange={handleCheckChange}
              loading={isPending || isUpdating || isPagePending}
            />
          </TabsContent>
          <TabsContent value="role">
            <RolePermissionsTab
              rolePermissions={rolePermissions}
              data={data}
              handleCheckChange={handleCheckChange}
              loading={isPending || isUpdating || isPagePending}
            />
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
      <AddRoleDialog
        open={addRoleOpen}
        onOpenChange={handleAddRoleClose}
        onCloseChange={handleAddRoleClose}
        refetch={refetch}
      />
    </Layout>
  );
};

export default Page;
