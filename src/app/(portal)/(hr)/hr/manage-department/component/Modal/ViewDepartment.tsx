import React, { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { DepartmentListType } from '@/libs/validations/project-department';

interface ModelProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  data?: DepartmentListType | null;
}

const ViewDepartment = ({ open, onCloseChange, data }: ModelProps) => {
  const firstName = data?.updatedBy?.firstName;
  const lastName = data?.updatedBy?.lastName;
  const avatar = data?.updatedBy?.Avatar;
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  const [activeTab, setActiveTab] = useState<string>('employee');
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`View Department Details`}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-2 flex h-9 p-0.5">
                <TabsTrigger value="employee">
                  Employees{' '}
                  <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                    {data?.employees?.length || 0}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="project">
                  Projects{' '}
                  <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                    {data?.projects?.length || 0}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="head">
                  Previous Heads{' '}
                  <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                    {data?.departmentHead?.filter(
                      employee => !employee.isCurrent,
                    ).length || 0}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {activeTab === 'employee' && (
            <>
              {' '}
              <div className="flex flex-row justify-between">
                <div className="w-5/12">
                  <p className="text-sm font-semibold">Department Name</p>
                </div>
                <div className="w-7/12">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {data?.departmentName}
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="w-5/12">
                  <p className="text-sm font-semibold">Department Head</p>
                </div>
                <div className="w-7/12">
                  <div className="flex items-center space-x-2">
                    <Avatar className="size-6">
                      <AvatarImage
                        src={avatar || ''}
                        alt={`${firstName} ${lastName}`}
                      />
                      <AvatarFallback className="uppercase">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <span className="max-w-[500px] truncate text-sm font-medium capitalize text-gray-600 dark:text-gray-300">
                      {`${firstName} ${lastName}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-sm font-semibold">Employee&apos;s List</p>
              </div>
              <ScrollArea className="h-40 w-full">
                <div className="space-y-4">
                  {data?.employees && data?.employees?.length > 0 ? (
                    data?.employees?.map(employee => {
                      const firstName = employee.firstName;
                      const lastName = employee.lastName;
                      const avatar = employee.Avatar;
                      const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

                      return (
                        <div
                          key={employee._id}
                          className="flex items-center space-x-2"
                        >
                          <Avatar className="size-6">
                            <AvatarImage
                              src={avatar || ''}
                              alt={`${firstName} ${lastName}`}
                            />
                            <AvatarFallback className="uppercase">
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-300">
                              {`${firstName} ${lastName}`}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {employee.companyEmail}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-xs text-gray-600 dark:text-gray-300">
                      No Employees!
                    </p>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
          {activeTab === 'project' && (
            <ScrollArea className="h-60 w-full">
              <div className="space-y-4">
                {data?.projects?.map(project => (
                  <div key={project._id} className="rounded-lg border p-4">
                    <div className="mb-2 flex justify-between">
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {project.projectName}
                      </p>
                      <Badge
                        className="capitalize"
                        variant={
                          project.status === 'Completed'
                            ? 'success'
                            : project.status === 'Overdue'
                              ? 'destructive'
                              : project.status === 'Pending'
                                ? 'secondary'
                                : project.status === 'Cancelled'
                                  ? 'error'
                                  : project.status === 'In Progress'
                                    ? 'warning'
                                    : project.status === 'Not Started'
                                      ? 'progress'
                                      : 'default'
                        }
                      >
                        {project.status || 'N/A'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {project.projectTitle}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {project.startDate
                          ? new Date(project.startDate).toDateString()
                          : 'N/A'}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Technology:</span>{' '}
                      {project.techStack?.join(', ') || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {activeTab === 'head' && (
            <div>
              <ScrollArea className="h-60 w-full">
                <div className="space-y-4">
                  {data?.departmentHead &&
                  data.departmentHead.some(employee => !employee.isCurrent) ? (
                    data.departmentHead
                      .filter(employee => !employee.isCurrent)
                      .map(employee => {
                        const user = employee?.user;
                        const firstName = user?.firstName || '';
                        const lastName = user?.lastName || '';
                        const companyEmail = user?.companyEmail || '';
                        const avatar = user?.Avatar || '';
                        const initials =
                          firstName && lastName
                            ? `${firstName.charAt(0)}${lastName.charAt(0)}`
                            : '';

                        return (
                          <div
                            key={employee?.user?._id}
                            className="flex justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <Avatar className="size-6">
                                <AvatarImage
                                  src={avatar}
                                  alt={`${firstName} ${lastName}`}
                                />
                                <AvatarFallback className="uppercase">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>

                              <div>
                                <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-300">
                                  {`${firstName} ${lastName}`}
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {companyEmail}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs">
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                {employee?.appointDate
                                  ? new Date(
                                      employee?.appointDate,
                                    ).toDateString()
                                  : 'N/A'}{' '}
                                {' - '}
                                {employee?.endDate
                                  ? new Date(employee?.endDate).toDateString()
                                  : 'N/A'}
                              </p>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-center text-xs text-gray-600 dark:text-gray-300">
                      No Heads!
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewDepartment;
