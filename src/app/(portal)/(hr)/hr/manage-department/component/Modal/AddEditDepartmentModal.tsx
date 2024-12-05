'use client';
import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import MultiSelectEmployee from '@/components/ui/employee-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MultiSelect from '@/components/ui/multiple-select';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

import { useProjectListQuery } from '@/hooks/hr/useProjectDepartment.hook';
import { useHrPerksEmpoyeeQuery } from '@/hooks/hrPerksList/useHrPerksList.hook';
import { DepartmentListType } from '@/libs/validations/project-department';
import {
  addDepartment,
  editDepartment,
} from '@/services/hr/project-department.service';

import { MessageErrorResponse } from '@/types';
import { HrPerksGetEmployees } from '@/types/hr-perks-list.types';

interface ModalProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  userId?: string;
  type: string;
  setRefetchProjectList: (refetch: boolean) => void;
  selectedRow?: DepartmentListType | null;
}

const FormSchema = z.object({
  name: z.string().min(1, 'Department Name is required'),
  head: z.string().min(1, 'Department Head is required'),
  projects: z.array(z.string()).min(1, 'At least one project is required'),
  employees: z.array(z.string()).min(1, 'At least one employee is required'),
  deleteEmployees: z.array(z.string()).optional(),
  deleteProjects: z.array(z.string()).optional(),
  newEmployees: z.array(z.string()).optional(),
  newProjects: z.array(z.string()).optional(),
  newHead: z.string().optional(),
});

export type FormData = z.infer<typeof FormSchema>;

const AddEditDepartmentModal = ({
  open,
  onCloseChange,
  userId,
  type,
  setRefetchProjectList,
  selectedRow,
}: ModalProps) => {
  const { data } = useHrPerksEmpoyeeQuery();
  const { data: ProjectList } = useProjectListQuery();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedEmployeeData, setSelectedEmployeeData] =
    useState<HrPerksGetEmployees>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      head: '',
      projects: [],
      employees: [],
      deleteEmployees: [],
      deleteProjects: [],
      newEmployees: [],
      newProjects: [],
      newHead: '',
    },
  });
  const handleEmployeeChange = (value: string) => {
    setSelectedEmployeeId(value);
    setSelectedEmployeeData(data?.data.find(employee => employee.id === value));
    setValue('head', value);
    setValue('newHead', value);
  };

  const projectOptions =
    ProjectList?.data?.map(project => ({
      value: project._id,
      label: project.projectName,
    })) || [];

  const handleEmployeesChange = (newSelectedIds: string[]) => {
    const previousSelectedIds =
      (selectedRow?.employees && selectedRow?.employees.map(emp => emp._id)) ||
      [];

    const newEmployeesSet = newSelectedIds.filter(
      id => !previousSelectedIds.includes(id),
    );
    const deleteEmployeesSet = previousSelectedIds.filter(
      id => !newSelectedIds.includes(id),
    );

    setValue('employees', newSelectedIds);
    setValue('newEmployees', newEmployeesSet);
    setValue('deleteEmployees', deleteEmployeesSet);
  };

  const handleProjectsChange = (newSelectedIds: string[]) => {
    const previousSelectedIds =
      selectedRow?.projects
        ?.map(proj => proj._id)
        .filter((id): id is string => id !== undefined) || [];

    const newProjectsSet = newSelectedIds.filter(
      id => !previousSelectedIds.includes(id),
    );
    const deleteProjectsSet = previousSelectedIds.filter(
      id => !newSelectedIds.includes(id),
    );

    setValue('projects', newSelectedIds);
    setValue('newProjects', newProjectsSet);
    setValue('deleteProjects', deleteProjectsSet);
  };

  const employees =
    data?.data?.map((employee: HrPerksGetEmployees) => ({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      avatar: employee.avatar || '',
    })) || [];

  useEffect(() => {
    if (type === 'edit' && selectedRow) {
      reset({
        name: selectedRow?.departmentName || '',
        projects:
          (selectedRow?.projects &&
            selectedRow?.projects.map(project => project._id)) ||
          [],
        employees:
          (selectedRow?.employees &&
            selectedRow?.employees.map(employee => employee._id)) ||
          [],
      });

      const currentHead =
        selectedRow?.departmentHead &&
        selectedRow?.departmentHead.find(head => head.isCurrent);

      if (currentHead?.user) {
        setSelectedEmployeeId(currentHead?.user?._id);
        setSelectedEmployeeData({
          id: currentHead?.user?._id,
          name: `${currentHead?.user?.firstName || ''} ${currentHead?.user?.lastName || ''}`,
          email: currentHead?.user?.companyEmail || '',
          avatar: currentHead?.user?.Avatar || '',
        });
        setValue('head', currentHead?.user?._id);
      }
    }
  }, [type, reset, selectedRow, setValue]);

  useEffect(() => {
    if (!open && type === 'add') {
      reset({
        name: '',
        head: '',
        projects: [],
        employees: [],
        deleteEmployees: [],
        deleteProjects: [],
      });
      setSelectedEmployeeId('');
    }
  }, [open, reset, type]);

  const { mutate, isPending } = useMutation({
    mutationFn: addDepartment,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Department Added Successfully!',
        variant: 'success',
      });
      reset();
      setRefetchProjectList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on adding the department!',
        variant: 'error',
      });
    },
  });

  const { mutate: EditMutate, isPending: EditPending } = useMutation({
    mutationFn: editDepartment,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Department Update Successfully!',
        variant: 'success',
      });
      reset();
      setRefetchProjectList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on editing the department!',
        variant: 'error',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (type === 'add') {
      const body = {
        userId,
        head: data?.head,
        name: data?.name,
        projects: data?.projects,
        employees: data?.employees,
      };
      mutate({ body });
    }
    if (type === 'edit') {
      const body = {
        ...(data?.newHead ? { head: data?.newHead } : {}),
        name: data?.name,
        ...(data?.newProjects && data?.newProjects?.length > 0
          ? { projects: data.newProjects }
          : {}),
        ...(data?.newEmployees && data?.newEmployees?.length > 0
          ? { employees: data.newEmployees }
          : {}),
        ...(data?.deleteEmployees && data?.deleteEmployees?.length > 0
          ? { deleteEmployees: data.deleteEmployees }
          : {}),
        ...(data?.deleteProjects && data?.deleteProjects?.length > 0
          ? { deleteProjects: data.deleteProjects }
          : {}),
      };

      const id = selectedRow?._id || '';

      EditMutate({ id, body });
    }
  };
  const showEmployees = watch('employees', []);
  const showProjects = watch('projects', []);

  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'add' ? 'Add Department' : 'Edit Department'}
          </DialogTitle>
        </DialogHeader>
        <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="name" className="mb-2 text-left">
                Department Name <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Please Enter department name"
                    {...field}
                  />
                )}
              />
              {errors.name && (
                <span className="text-sm text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="head" className="mb-2 text-left">
                Department Head <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="head"
                control={control}
                render={() => (
                  <Select
                    onValueChange={handleEmployeeChange}
                    value={selectedEmployeeId}
                  >
                    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 md:max-w-full">
                      <SelectTrigger className="h-[50px] w-full p-4">
                        {selectedEmployeeId ? (
                          <div className="flex items-center gap-1 sm:gap-4">
                            <Avatar className="size-8">
                              <AvatarImage
                                src={selectedEmployeeData?.avatar || ''}
                                alt={`${selectedEmployeeData?.avatar}`}
                              />
                              <AvatarFallback className="uppercase">
                                {selectedEmployeeData?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                              <SelectValue>
                                <p className="text-sm">
                                  {selectedEmployeeData?.name}
                                </p>
                              </SelectValue>
                              <p className="text-xs text-muted-foreground">
                                {selectedEmployeeData?.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <SelectValue placeholder="Select Employee" />
                        )}
                      </SelectTrigger>
                    </div>
                    <SelectContent className="w-fit">
                      <SelectGroup>
                        <SelectLabel>Select Employee</SelectLabel>
                        {data?.data.map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            <div className="flex items-center gap-1 sm:gap-4">
                              <Avatar className="size-8">
                                <AvatarImage
                                  src={employee.avatar || ''}
                                  alt={`${employee.avatar}`}
                                />
                                <AvatarFallback className="uppercase">
                                  {employee.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col justify-start">
                                <p className="text-sm">{employee.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {employee.email}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.head && (
                <span className="text-sm text-red-500">
                  {errors.head.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <div className="mb-1 flex justify-between">
                <Label htmlFor="projects" className="mb-2 text-left">
                  Select Project<span className="text-red-600">*</span>{' '}
                </Label>
                {showProjects.length > 0 && (
                  <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                    {showProjects.length || 0}
                  </span>
                )}
              </div>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => {
                  const selectedProjectNames = projectOptions
                    .filter(option => field.value?.includes(option.value))
                    .map(option => option.label);

                  const labelText =
                    selectedProjectNames.length > 0
                      ? selectedProjectNames.join(', ')
                      : 'Select Project';

                  return (
                    <MultiSelect
                      type={'Projects'}
                      label={labelText}
                      options={projectOptions}
                      selectedValues={field.value || []}
                      onChange={(selectedValues: string[]) =>
                        handleProjectsChange(selectedValues)
                      }
                    />
                  );
                }}
              />
              {errors.projects && (
                <span className="text-sm text-red-500">
                  {errors.projects.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <div className="mb-1 flex justify-between">
                <Label htmlFor="employees" className="mb-2 text-left">
                  Add Employee <span className="text-red-600">*</span>
                </Label>
                {showEmployees.length > 0 && (
                  <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                    {showEmployees.length || 0}
                  </span>
                )}
              </div>
              <Controller
                name="employees"
                control={control}
                render={({ field }) => (
                  <MultiSelectEmployee
                    label="Add Employees"
                    options={employees}
                    selectedValues={field.value || []}
                    onChange={(selectedIds: string[]) => {
                      field.onChange(selectedIds);
                      handleEmployeesChange(selectedIds);
                    }}
                  />
                )}
              />
              {showEmployees?.length === 0 && errors.employees && (
                <span className="text-sm text-red-500">
                  {errors.employees.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              size={'sm'}
              disabled={type === 'add' ? isPending : EditPending}
            >
              {type === 'add' ? 'Add ' : 'Update '}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditDepartmentModal;
