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

import { ProjectListType } from '@/libs/validations/project-department';

interface ModelProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  data?: ProjectListType | null;
}
const ViewProject = ({ open, onCloseChange, data }: ModelProps) => {
  const firstName = data?.teamLead?.firstName;
  const lastName = data?.teamLead?.lastName;
  const avatar = data?.teamLead?.Avatar;
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  const [activeTab, setActiveTab] = useState<string>('project');
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`View Project Details`}</DialogTitle>
          </DialogHeader>
          <div>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="flex h-9 p-0.5">
                <TabsTrigger value="project" className="flex-1 text-center">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="tech" className="flex-1 text-center">
                  Tech Stack{' '}
                  <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                    {data?.techStack?.length || 0}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="team" className="flex-1 text-center">
                  Team{' '}
                  <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                    {data?.teamMembers?.length || 0}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {activeTab === 'project' && (
            <>
              <div className="flex justify-end">
                <Badge
                  className="capitalize"
                  variant={
                    data?.status === 'Completed'
                      ? 'success'
                      : data?.status === 'Overdue'
                        ? 'destructive'
                        : data?.status === 'Pending'
                          ? 'secondary'
                          : data?.status === 'Cancelled'
                            ? 'error'
                            : data?.status === 'In Progress'
                              ? 'default'
                              : data?.status === 'Not Started'
                                ? 'progress'
                                : 'warning'
                  }
                >
                  {data?.status || 'N/A'}
                </Badge>
              </div>
              <div className="flex flex-row justify-between">
                <div className="w-5/12">
                  <p className="text-sm font-semibold">Project Name</p>
                </div>
                <div className="w-7/12">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {data?.projectName}
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="w-5/12">
                  <p className="text-sm font-semibold">Project Title</p>
                </div>
                <div className="w-7/12">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {data?.projectTitle}
                  </p>
                </div>
              </div>

              {data?.status === 'Cancelled' && (
                <div className="flex flex-row justify-between">
                  <div className="w-5/12">
                    <p className="text-sm font-semibold">Cancellation Reason</p>
                  </div>
                  <div className="w-7/12">
                    <p className="truncate text-sm text-gray-600 dark:text-gray-300">
                      {data?.cancellationReason || '-'}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex flex-row justify-between">
                <div className="w-5/12">
                  <p className="text-sm font-semibold">Project Start Date</p>
                </div>
                <div className="w-7/12">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {data?.startDate
                      ? (() => {
                          const field = new Date(Date.parse(data?.startDate));
                          const day = field.toLocaleDateString('en-US', {
                            weekday: 'short',
                          });
                          const date = field.toDateString().slice(4);
                          return (
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{day}</Badge>
                              <span className="max-w-[500px] truncate">
                                {date}
                              </span>
                            </div>
                          );
                        })()
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <div className="w-5/12">
                  <p className="text-sm font-semibold">Project End Date</p>
                </div>
                <div className="w-7/12">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {data?.isContinue === true ? (
                      'Continue'
                    ) : (
                      <>
                        {' '}
                        {data?.endDate
                          ? (() => {
                              const field = new Date(Date.parse(data?.endDate));
                              const day = field.toLocaleDateString('en-US', {
                                weekday: 'short',
                              });
                              const date = field.toDateString().slice(4);
                              return (
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">{day}</Badge>
                                  <span className="max-w-[500px] truncate">
                                    {date}
                                  </span>
                                </div>
                              );
                            })()
                          : 'N/A'}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <div className="w-5/12">
                  <p className="text-sm font-semibold">Project Deadline</p>
                </div>
                <div className="w-7/12">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {data?.deadline
                      ? (() => {
                          const field = new Date(Date.parse(data?.deadline));
                          const day = field.toLocaleDateString('en-US', {
                            weekday: 'short',
                          });
                          const date = field.toDateString().slice(4);
                          return (
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{day}</Badge>
                              <span className="max-w-[500px] truncate">
                                {date}
                              </span>
                            </div>
                          );
                        })()
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="w-5/12">
                  <p className="text-sm font-semibold">Project Lead</p>
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
                <div className="w-5/12">
                  <p className="text-sm font-semibold">Created By</p>
                </div>
                <div className="w-7/12">
                  <div className="flex items-center space-x-2">
                    <Avatar className="size-6">
                      <AvatarImage
                        src={(data?.updatedBy && data?.updatedBy?.Avatar) || ''}
                        alt={`${data?.updatedBy?.firstName} ${data?.updatedBy?.lastName}`}
                      />
                      <AvatarFallback className="uppercase">
                        {data?.updatedBy?.firstName?.charAt(0) || ''}{' '}
                        {data?.updatedBy?.lastName?.charAt(0) || ''}
                      </AvatarFallback>
                    </Avatar>

                    <span className="max-w-[500px] truncate text-sm font-medium capitalize text-gray-600 dark:text-gray-300">
                      {`${data?.updatedBy?.firstName} ${data?.updatedBy?.lastName}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <p className="text-sm font-semibold">Project Description</p>
                <p className="text-justify indent-16 text-gray-600 dark:text-gray-300">
                  {data?.projectDescription}
                </p>
              </div>
            </>
          )}

          {activeTab === 'tech' && (
            <>
              <div className="flex flex-row justify-between">
                <p className="text-sm font-semibold">Technology Stack</p>
              </div>
              <ScrollArea className="h-60 w-full">
                {data?.techStack && data?.techStack?.length > 0 ? (
                  <ul
                    className="grid list-disc grid-cols-2 gap-x-6 pl-5"
                    style={{
                      listStyleType: 'disc',
                      listStylePosition: 'inside',
                    }}
                  >
                    {data.techStack.map((tech, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-300"
                        style={{ fontSize: '1.1rem', lineHeight: '1.5rem' }}
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-xs text-gray-600 dark:text-gray-300">
                    No Tech Stack Available!
                  </p>
                )}
              </ScrollArea>
            </>
          )}

          {activeTab === 'team' && (
            <>
              <div className="flex flex-row justify-between">
                <p className="text-sm font-semibold">Team List</p>
              </div>
              <ScrollArea className="h-60 w-full">
                <div className="space-y-4">
                  {data?.teamMembers && data?.teamMembers?.length > 0 ? (
                    data?.teamMembers?.map(employee => {
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
                              {employee.companyEmail}{' '}
                              {employee.Designation &&
                                ` | ${employee.Designation}`}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-xs text-gray-600 dark:text-gray-300">
                      No Team!
                    </p>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewProject;
