import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import CustomDayPicker from '@/components/CustomDayPicker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { RadioInput } from '@/components/ui/radio';
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

import { useHrPerksEmpoyeeQuery } from '@/hooks/hrPerksList/useHrPerksList.hook';
import { ProjectListType } from '@/libs/validations/project-department';
import {
  addProject,
  editProject,
} from '@/services/hr/project-department.service';
import techStack from '@/utils/tectStack.utils';

import { MessageErrorResponse } from '@/types';
import { HrPerksGetEmployees } from '@/types/hr-perks-list.types';

interface ModalProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  userId?: string;
  type: string;
  setRefetchProjectList: (refetch: boolean) => void;
  selectedRow?: ProjectListType | null;
}
const FormSchema = z
  .object({
    title: z.string().min(1, 'Project Title is required'),
    name: z.string().min(1, 'Project Name is required'),
    description: z.string().min(1, 'Project Description is required'),
    reason: z.string().optional(),
    lead: z.string().min(1, 'Project Lead is required'),
    startDate: z.date(),
    endDate: z.date(),
    deadline: z.date(),
    status: z.string().optional(),
    techStack: z.array(z.string()).min(1, 'At least one tech is required'),
    teamMembers: z
      .array(z.string())
      .min(1, 'At least one team member is required'),
    deleteTeam: z.array(z.string()).optional(),
    deleteTech: z.array(z.string()).optional(),
    newTeam: z.array(z.string()).optional(),
    newTech: z.array(z.string()).optional(),
    newLead: z.string().optional(),
  })
  .refine(data => data.startDate <= data.deadline, {
    message: 'Deadline date should be greater than start date',
  });

export type FormData = z.infer<typeof FormSchema>;

const AddEditProjectModal = ({
  open,
  onCloseChange,
  userId,
  type,
  setRefetchProjectList,
  selectedRow,
}: ModalProps) => {
  const { data } = useHrPerksEmpoyeeQuery();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedEmployeeData, setSelectedEmployeeData] =
    useState<HrPerksGetEmployees>();
  const [isContinue, setIsContinue] = useState<boolean>(false);

  const handleCheckboxChange = (checked: boolean) => {
    setIsContinue(checked);
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      lead: '',
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      deadline: new Date(),
      status: '',
      techStack: [],
      teamMembers: [],
      deleteTeam: [],
      deleteTech: [],
      newTeam: [],
      newTech: [],
      newLead: '',
      reason: '',
    },
  });
  const handleEmployeeChange = (value: string) => {
    setSelectedEmployeeId(value);
    setSelectedEmployeeData(data?.data.find(employee => employee.id === value));
    setValue('lead', value);
    setValue('newLead', value);
  };

  const techOptions =
    techStack?.map(tech => ({
      value: tech.id,
      label: tech.tech,
    })) || [];

  const employees =
    data?.data?.map((employee: HrPerksGetEmployees) => ({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      avatar: employee.avatar || '',
    })) || [];

  const handleTechChange = (selectedIds: string[]) => {
    const selectedNames = selectedIds
      .map(id => techOptions.find(option => option.value === id)?.label)
      .filter((name): name is string => name !== undefined);

    const previousSelectedTech =
      selectedRow?.techStack?.filter(
        (name): name is string => typeof name === 'string',
      ) || [];

    const newTechSet = selectedNames.filter(
      name => !previousSelectedTech.includes(name),
    );
    const deleteTechSet = previousSelectedTech.filter(
      name => !selectedNames.includes(name),
    );

    setValue('techStack', selectedNames);
    setValue('newTech', newTechSet);
    setValue('deleteTech', deleteTechSet);
  };

  useEffect(() => {
    if (type === 'edit' && selectedRow) {
      reset({
        name: selectedRow?.projectName || '',
        title: selectedRow?.projectTitle || '',
        description: selectedRow?.projectDescription || '',
        reason: selectedRow?.cancellationReason || '',
        startDate: selectedRow?.startDate
          ? new Date(selectedRow?.startDate)
          : new Date(),
        endDate: selectedRow?.endDate
          ? new Date(selectedRow?.endDate)
          : new Date(),
        deadline: selectedRow?.deadline
          ? new Date(selectedRow?.deadline)
          : new Date(),
        status: selectedRow?.status || '',
        techStack: selectedRow?.techStack || [],

        teamMembers:
          (selectedRow?.teamMembers &&
            selectedRow?.teamMembers.map(employee => employee._id)) ||
          [],
      });
      if (selectedRow?.isContinue) {
        setIsContinue(selectedRow?.isContinue);
      }
      if (selectedRow?.teamLead) {
        setSelectedEmployeeId(selectedRow?.teamLead?._id);
        setSelectedEmployeeData({
          id: selectedRow?.teamLead?._id,
          name: `${selectedRow?.teamLead?.firstName || ''} ${selectedRow?.teamLead?.lastName || ''}`,
          email: selectedRow?.teamLead?.companyEmail || '',
          avatar: selectedRow?.teamLead?.Avatar || '',
        });
        setValue('lead', selectedRow?.teamLead?._id);
      }
    }
  }, [type, reset, selectedRow, setValue]);

  useEffect(() => {
    if (!open && type === 'add') {
      reset({
        name: '',
        lead: '',
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        deadline: new Date(),
        status: '',
        techStack: [],
        teamMembers: [],
        deleteTeam: [],
        deleteTech: [],
        newTeam: [],
        newTech: [],
        newLead: '',
        reason: '',
      });
      setSelectedEmployeeId('');
      setIsContinue(false);
    }
  }, [open, reset, type]);

  const handleEmployeesChange = (newSelectedIds: string[]) => {
    const previousSelectedIds =
      (selectedRow?.teamMembers &&
        selectedRow?.teamMembers.map(emp => emp._id)) ||
      [];

    const newEmployeesSet = newSelectedIds.filter(
      id => !previousSelectedIds.includes(id),
    );
    const deleteEmployeesSet = previousSelectedIds.filter(
      id => !newSelectedIds.includes(id),
    );

    setValue('teamMembers', newSelectedIds);
    setValue('newTeam', newEmployeesSet);
    setValue('deleteTeam', deleteEmployeesSet);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addProject,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Project Added Successfully!',
        variant: 'success',
      });
      reset();
      setRefetchProjectList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on adding the project!',
        variant: 'error',
      });
    },
  });

  const { mutate: EditMutate, isPending: EditPending } = useMutation({
    mutationFn: editProject,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'project Update Successfully!',
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
          err?.response?.data?.message || 'Error on editing the project!',
        variant: 'error',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (!isContinue && data.startDate > data.endDate) {
      setError('endDate', {
        type: 'manual',
        message: 'End date should be greater than or equal to the start date!',
      });
      return;
    }
    if (type === 'add') {
      const body = {
        userId,
        teamLead: data?.lead,
        name: data?.name,
        title: data?.title,
        description: data?.description,
        startDate: data?.startDate
          ? new Date(data.startDate).toISOString().split('T')[0]
          : '',
        endDate: isContinue
          ? undefined
          : data?.endDate
            ? new Date(data.endDate).toISOString().split('T')[0]
            : '',
        deadline: data?.deadline
          ? new Date(data.deadline).toISOString().split('T')[0]
          : '',
        isContinue,
        techStack: data?.techStack,
        teamMembers: data?.teamMembers,
      };
      mutate({ body });
    }
    if (type === 'edit') {
      if (data.status === 'Cancelled' && !data.reason) {
        setError('reason', {
          type: 'manual',
          message: 'Cancellation reason is required!',
        });
        return;
      }
      const body = {
        name: data?.name,
        title: data?.title,
        description: data?.description,
        startDate: data?.startDate
          ? new Date(data.startDate).toISOString().split('T')[0]
          : '',
        endDate: data?.endDate
          ? new Date(data.endDate).toISOString().split('T')[0]
          : '',
        deadline: data?.deadline
          ? new Date(data.deadline).toISOString().split('T')[0]
          : '',
        ...(data?.newLead ? { teamLead: data?.newLead } : {}),
        ...(data?.status ? { status: data?.status } : {}),
        ...(data?.newTech && data?.newTech?.length > 0
          ? { techStack: data.newTech }
          : {}),
        ...(data?.newTeam && data?.newTeam?.length > 0
          ? { teamMembers: data.newTeam }
          : {}),
        ...(data?.deleteTeam && data?.deleteTeam?.length > 0
          ? { deletedTechMembers: data.deleteTeam }
          : {}),
        ...(data?.deleteTech && data?.deleteTech?.length > 0
          ? { deletedTechStack: data.deleteTech }
          : {}),
        ...(data?.status === 'Cancelled' && data?.reason
          ? { cancellationReason: data?.reason }
          : {}),
      };

      const id = selectedRow?._id || '';

      EditMutate({ id, body });
    }
  };
  const showEmployees = watch('teamMembers', []);
  const showTech = watch('techStack', []);
  const showStatus = watch('status', '');
  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent className="md:max-w-4xl lg:max-w-4xl">
        {' '}
        <DialogHeader>
          <DialogTitle>
            {type === 'add' ? 'Add Project' : 'Edit Project'}
          </DialogTitle>
        </DialogHeader>
        <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="flex flex-col">
              <Label htmlFor="name" className="mb-2 text-left">
                Project Name <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Please Enter project name"
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
            <div className="flex flex-col">
              <Label htmlFor="title" className="mb-2 text-left">
                Project Title <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="title"
                    placeholder="Please Enter project title"
                    {...field}
                  />
                )}
              />
              {errors.title && (
                <span className="text-sm text-red-500">
                  {errors.title.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="description" className="mb-2 text-left">
                Project Description <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Please Enter project description"
                    {...field}
                  />
                )}
              />
              {errors.description && (
                <span className="text-sm text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="flex flex-col">
              <Label htmlFor="startDate" className="mb-2 text-left">
                Start Date <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <CustomDayPicker
                    initialDate={field.value}
                    onDateChange={field.onChange}
                    className="h-auto"
                    disabled={date => date < new Date()}
                  />
                )}
              />
              {errors.startDate && (
                <span className="text-sm text-red-500">
                  {errors.startDate.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="endDate" className="mb-2 text-left">
                End Date <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <CustomDayPicker
                    initialDate={field.value}
                    onDateChange={field.onChange}
                    className="h-auto"
                    disabled={date => date < new Date()}
                    disable={isContinue}
                  />
                )}
              />
              {errors.endDate && (
                <span className="text-sm text-red-500">
                  {errors.endDate.message}
                </span>
              )}
              <div className="mt-2 flex flex-row gap-2">
                <Checkbox
                  checked={isContinue}
                  aria-label="Continue"
                  className="translate-y-[2px]"
                  onCheckedChange={checked => {
                    const isChecked = Boolean(checked);
                    handleCheckboxChange(isChecked);
                  }}
                />
                <Label className="mt-1 text-xs">Continue</Label>
              </div>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="deadline" className="mb-2 text-left">
                Deadline <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="deadline"
                control={control}
                render={({ field }) => (
                  <CustomDayPicker
                    initialDate={field.value}
                    onDateChange={field.onChange}
                    className="h-auto"
                    disabled={date => date < new Date()}
                  />
                )}
              />
              {errors.deadline && (
                <span className="text-sm text-red-500">
                  {errors.deadline.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="lead" className="mb-3 text-left">
                Project Lead <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="lead"
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
                          <SelectValue placeholder="Select Team Lead" />
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
              {errors.lead && (
                <span className="text-sm text-red-500">
                  {errors.lead.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="mb-1 flex justify-between">
                <Label htmlFor="teamMembers" className="mb-2 text-left">
                  Add Team <span className="text-red-600">*</span>
                </Label>
                {showEmployees.length > 0 && (
                  <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                    {showEmployees.length || 0}
                  </span>
                )}
              </div>
              <Controller
                name="teamMembers"
                control={control}
                render={({ field }) => (
                  <MultiSelectEmployee
                    label="Add Team"
                    options={employees}
                    selectedValues={field.value || []}
                    onChange={(selectedIds: string[]) => {
                      field.onChange(selectedIds);
                      handleEmployeesChange(selectedIds);
                    }}
                  />
                )}
              />
              {showEmployees?.length === 0 && errors.teamMembers && (
                <span className="text-sm text-red-500">
                  {errors.teamMembers.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="mb-1 flex justify-between">
                <Label htmlFor="techStack" className="mb-2 text-left">
                  Tech Stack<span className="text-red-600">*</span>
                </Label>
                {showTech.length > 0 && (
                  <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                    {showTech.length || 0}
                  </span>
                )}
              </div>
              <Controller
                name="techStack"
                control={control}
                render={({ field }) => {
                  const selectedIds = techOptions
                    .filter(option => field.value?.includes(option.label))
                    .map(option => option.value);

                  const labelText =
                    field.value?.length > 0
                      ? field.value.join(', ')
                      : 'Select Technology';

                  return (
                    <MultiSelect
                      type={'Technology'}
                      label={labelText}
                      options={techOptions}
                      selectedValues={selectedIds}
                      onChange={(selectedValues: string[]) =>
                        handleTechChange(selectedValues)
                      }
                    />
                  );
                }}
              />
              {errors.techStack && (
                <span className="text-sm text-red-500">
                  {errors.techStack.message}
                </span>
              )}
            </div>
          </div>
          {type === 'edit' && selectedRow?.isActive === true && (
            <div className="flex justify-between space-x-4">
              <Label htmlFor="status" className="text-left">
                Project Status
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-0 space-x-4 md:gap-4 lg:gap-4">
                    <RadioInput
                      id="completed"
                      label="Completed"
                      value="Completed"
                      checked={field.value === 'Completed'}
                      onChange={event => {
                        const value = event.target.value;
                        field.onChange(value);
                      }}
                    />
                    <RadioInput
                      id="pending"
                      label="Pending"
                      value="Pending"
                      checked={field.value === 'Pending'}
                      onChange={event => {
                        const value = event.target.value;
                        field.onChange(value);
                      }}
                    />
                    <RadioInput
                      id="overdue"
                      label="Overdue"
                      value="Overdue"
                      checked={field.value === 'Overdue'}
                      onChange={event => {
                        const value = event.target.value;
                        field.onChange(value);
                      }}
                    />
                    <RadioInput
                      id="cancelled"
                      label="Cancelled"
                      value="Cancelled"
                      checked={field.value === 'Cancelled'}
                      onChange={event => {
                        const value = event.target.value;
                        field.onChange(value);
                      }}
                    />
                  </div>
                )}
              />
            </div>
          )}
          {showStatus === 'Cancelled' && type === 'edit' && (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                <div className="flex flex-col">
                  <Label htmlFor="reason" className="mb-2 text-left">
                    Cancellation Reason <span className="text-red-600">*</span>
                  </Label>
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="name"
                        placeholder="Please enter cancellation reason"
                        {...field}
                      />
                    )}
                  />
                  {errors.reason && (
                    <span className="text-sm text-red-500">
                      {errors.reason.message}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
          <DialogFooter>
            <Button
              size={'sm'}
              type="submit"
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

export default AddEditProjectModal;
