import React from 'react';

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

import {
  CategorizedPermissionsRole,
  ManagerRolePermissionsApiResponse,
} from '@/libs/validations/manager-role-permissions';

interface Props {
  rolePermissions?: CategorizedPermissionsRole;
  data?: ManagerRolePermissionsApiResponse;
  handleCheckChange: (
    roleId: number,
    permissionName: string,
    checked: boolean,
    action: 'Read' | 'Write',
  ) => void;
  loading: boolean;
}

function formatCamelCase(text: string) {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}

const RolePermissionsTab = ({
  rolePermissions,
  data,
  handleCheckChange,
  loading,
}: Props) => {
  return (
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
                    <TableHeader className="w-full">Permission</TableHeader>
                    <TableHeader className="w-fit text-right">Read</TableHeader>
                    <TableHeader className="-mr-36 w-fit text-right">
                      Write
                    </TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody className="max-h-[500px] overflow-y-auto">
                  {role.permissions.map((permission, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {formatCamelCase(permission.category)}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={permission.read}
                          onCheckedChange={checked => {
                            handleCheckChange(
                              role.roleId,
                              permission.category,
                              checked,
                              'Read',
                            );
                          }}
                          disabled={loading}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={permission.write}
                          onCheckedChange={checked => {
                            handleCheckChange(
                              role.roleId,
                              permission.category,
                              checked,
                              'Write',
                            );
                          }}
                          disabled={loading}
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
  );
};

export default RolePermissionsTab;
