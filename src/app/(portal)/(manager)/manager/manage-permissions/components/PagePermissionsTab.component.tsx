import React from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
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

import { ManagerRolePermissionsApiResponse } from '@/libs/validations/manager-role-permissions';

function formatCamelCase(text: string) {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before each uppercase letter
    .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
}

interface Props {
  pagePermissions?: ManagerRolePermissionsApiResponse;
  data?: ManagerRolePermissionsApiResponse;
  handleCheckChange: (
    roleId: number,
    permissionName: string,
    checked: boolean,
  ) => void;
  loading: boolean;
}

const PagePermissionsTab = ({
  pagePermissions,
  data,
  handleCheckChange,
  loading,
}: Props) => {
  return (
    <div className="size-full">
      <Tabs
        className="flex size-full flex-col gap-4 md:flex-row"
        defaultValue={pagePermissions?.data[0]._id || data?.data[0]._id}
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
            <TabsContent key={role._id} value={role._id}>
              <ScrollArea className="h-[500px] w-full">
                <Table className="w-full">
                  <TableHead className="w-full">
                    <TableRow className="flex flex-row justify-between">
                      <TableHeader className="w-1/2">Permission</TableHeader>
                      <TableHeader className="-mr-20 w-1/2 text-right">
                        Allowed
                      </TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody className="max-h-[500px] overflow-y-auto">
                    {role.permissions.map(permission => (
                      <TableRow key={permission._id}>
                        <TableCell>
                          {formatCamelCase(permission.name).slice(7)}
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
                            disabled={loading}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default PagePermissionsTab;
