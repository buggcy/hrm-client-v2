import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

import { ConfigurationType } from '@/libs/validations/hr-configuration';
import {
  addDesignationType,
  addEducationType,
  addExperienceType,
  addFeedbackType,
  editDesignationType,
  editEducationType,
  editExperienceType,
  editFeedbackType,
} from '@/services/hr/hrConfiguration.service';

import { MessageErrorResponse } from '@/types';

interface DialogProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  type: string;
  userId: string;
  setRefetchConfigurationList: (refetch: boolean) => void;
  TypeToEdit: ConfigurationType | null;
  moduleType: string;
}
const FormSchema = z.object({
  type: z.string().min(1, 'type is required'),
});

export type TypeFormData = z.infer<typeof FormSchema>;

export function AddEditTypeDialog({
  open,
  onCloseChange,
  type,
  userId,
  setRefetchConfigurationList,
  TypeToEdit,
  moduleType,
}: DialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TypeFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: '',
    },
  });
  const [isIntern, setIsIntern] = useState<boolean>(false);
  const [isProbational, setIsProbational] = useState<boolean>(false);

  const handleInternChange = (checked: boolean) => {
    setIsIntern(checked);
  };

  const handleProbationalChange = (checked: boolean) => {
    setIsProbational(checked);
  };

  useEffect(() => {
    if (moduleType === 'Education' && type === 'edit' && TypeToEdit) {
      reset({
        type: TypeToEdit?.educationType || '',
      });
    } else if (moduleType === 'Experience' && type === 'edit' && TypeToEdit) {
      reset({
        type: TypeToEdit?.experienceType || '',
      });
    } else if (moduleType === 'Designation' && type === 'edit' && TypeToEdit) {
      reset({
        type: TypeToEdit?.designationType || '',
      });
    } else if (moduleType === 'Feedback' && type === 'edit' && TypeToEdit) {
      reset({
        type: TypeToEdit?.feedbackType || '',
      });
    }
  }, [TypeToEdit, type, reset, moduleType]);

  useEffect(() => {
    if (!open) {
      reset();
      setIsIntern(false);
      setIsProbational(false);
    }
  }, [open, reset]);

  const { mutate: AddEducationMutate, isPending: AddEducationPending } =
    useMutation({
      mutationFn: addEducationType,
      onSuccess: response => {
        toast({
          title: 'Success',
          description:
            response?.message || 'Education Type Added Successfully!',
          variant: 'success',
        });
        reset();
        setRefetchConfigurationList(true);
        onCloseChange(false);
      },
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description: err.message || 'Error on adding education type!',
          variant: 'error',
        });
      },
    });

  const { mutate: EditEducationMutate, isPending: EditEducationPending } =
    useMutation({
      mutationFn: editEducationType,
      onSuccess: response => {
        toast({
          title: 'Success',
          description:
            response?.message || 'Education Type Updated Successfully!',
          variant: 'success',
        });
        reset();
        setRefetchConfigurationList(true);
        onCloseChange(false);
      },
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description: err.message || 'Error on updating the education type!',
          variant: 'error',
        });
      },
    });

  const { mutate: AddExperienceMutate, isPending: AddExperiencePending } =
    useMutation({
      mutationFn: addExperienceType,
      onSuccess: response => {
        toast({
          title: 'Success',
          description:
            response?.message || 'Experience Type Added Successfully!',
          variant: 'success',
        });
        reset();
        setRefetchConfigurationList(true);
        onCloseChange(false);
      },
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description: err.message || 'Error on adding experience type!',
          variant: 'error',
        });
      },
    });
  const { mutate: EditExperienceMutate, isPending: EditExperiencePending } =
    useMutation({
      mutationFn: editExperienceType,
      onSuccess: response => {
        toast({
          title: 'Success',
          description:
            response?.message || 'Experience Type Updated Successfully!',
          variant: 'success',
        });
        reset();
        setRefetchConfigurationList(true);
        onCloseChange(false);
      },
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description: err.message || 'Error on updating the experience type!',
          variant: 'error',
        });
      },
    });

  const { mutate: AddDesignationMutate, isPending: AddDesignationPending } =
    useMutation({
      mutationFn: addDesignationType,
      onSuccess: response => {
        toast({
          title: 'Success',
          description:
            response?.message || 'Designation Type Added Successfully!',
          variant: 'success',
        });
        reset();
        setRefetchConfigurationList(true);
        onCloseChange(false);
      },
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description: err.message || 'Error on adding designation type!',
          variant: 'error',
        });
      },
    });
  const { mutate: EditDesignationMutate, isPending: EditDesignationPending } =
    useMutation({
      mutationFn: editDesignationType,
      onSuccess: response => {
        toast({
          title: 'Success',
          description:
            response?.message || 'Designation Type Updated Successfully!',
          variant: 'success',
        });
        reset();
        setRefetchConfigurationList(true);
        onCloseChange(false);
      },
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description: err.message || 'Error on updating the designation type!',
          variant: 'error',
        });
      },
    });

  const { mutate: AddFeedbackMutate, isPending: AddFeedbackPending } =
    useMutation({
      mutationFn: addFeedbackType,
      onSuccess: response => {
        toast({
          title: 'Success',
          description: response?.message || 'Feedback Type Added Successfully!',
          variant: 'success',
        });
        reset();
        setRefetchConfigurationList(true);
        onCloseChange(false);
      },
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description: err.message || 'Error on adding feedback type!',
          variant: 'error',
        });
      },
    });

  const { mutate: EditFeedbackMutate, isPending: EditFeedbackPending } =
    useMutation({
      mutationFn: editFeedbackType,
      onSuccess: response => {
        toast({
          title: 'Success',
          description:
            response?.message || 'Feedback Type Updated Successfully!',
          variant: 'success',
        });
        reset();
        setRefetchConfigurationList(true);
        onCloseChange(false);
      },
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description: err.message || 'Error on updating the feedback type!',
          variant: 'error',
        });
      },
    });

  const onSubmit = (data: TypeFormData) => {
    if (moduleType === 'Education') {
      const addEducationPayload = {
        userId,
        educationType: data?.type,
      };
      const editEducationPayload = {
        id: TypeToEdit?._id ?? '',
        userId,
        educationType: data?.type,
      };

      if (moduleType === 'Education' && type === 'add') {
        AddEducationMutate(addEducationPayload);
      } else if (moduleType === 'Education' && type === 'edit') {
        EditEducationMutate(editEducationPayload);
      }
    }

    if (moduleType === 'Experience') {
      const addExperiencePayload = {
        userId,
        experienceType: data?.type,
      };
      const editExperiencePayload = {
        id: TypeToEdit?._id ?? '',
        userId,
        experienceType: data?.type,
      };
      if (moduleType === 'Experience' && type === 'add') {
        AddExperienceMutate(addExperiencePayload);
      } else if (moduleType === 'Experience' && type === 'edit') {
        EditExperienceMutate(editExperiencePayload);
      }
    }
    if (moduleType === 'Designation') {
      const addDesignationPayload = {
        userId,
        designationType: data?.type,
        isIntern,
        isProbational,
      };
      const editDesignationPayload = {
        id: TypeToEdit?._id ?? '',
        userId,
        designationType: data?.type,
      };

      if (moduleType === 'Designation' && type === 'add') {
        AddDesignationMutate(addDesignationPayload);
      } else if (moduleType === 'Designation' && type === 'edit') {
        EditDesignationMutate(editDesignationPayload);
      }
    }
    if (moduleType === 'Feedback') {
      const addFeedbackPayload = {
        userId,
        feedbackType: data?.type,
      };
      const editFeedbackPayload = {
        id: TypeToEdit?._id ?? '',
        userId,
        feedbackType: data?.type,
      };

      if (moduleType === 'Feedback' && type === 'add') {
        AddFeedbackMutate(addFeedbackPayload);
      } else if (moduleType === 'Feedback' && type === 'edit') {
        EditFeedbackMutate(editFeedbackPayload);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {moduleType === 'Education' && type === 'add'
              ? 'Add Education Type'
              : moduleType === 'Education' && type === 'edit'
                ? 'Edit Education Type'
                : moduleType === 'Experience' && type === 'add'
                  ? 'Add Experience Type'
                  : moduleType === 'Experience' && type === 'edit'
                    ? 'Edit Experience Type'
                    : moduleType === 'Designation' && type === 'edit'
                      ? 'Edit Designation Type'
                      : moduleType === 'Designation' && type === 'add'
                        ? 'Add Designation Type'
                        : moduleType === 'Feedback' && type === 'edit'
                          ? 'Edit Feedback Type'
                          : moduleType === 'Feedback' && type === 'add'
                            ? 'Add Feedback Type'
                            : null}
          </DialogTitle>
        </DialogHeader>
        <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="type" className="mb-2 text-left">
                {moduleType} Type <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="type"
                    placeholder={`Enter ${moduleType} Type...`}
                    {...field}
                  />
                )}
              />
              {moduleType === 'Designation' && type === 'add' && (
                <div className="mt-2 flex flex-row gap-3">
                  <div className="m-1 flex flex-row gap-2">
                    <Checkbox
                      checked={isIntern}
                      aria-label="Immediate Termination"
                      className="translate-y-[2px]"
                      onCheckedChange={checked => {
                        const isChecked = Boolean(checked);
                        handleInternChange(isChecked);
                      }}
                    />
                    <Label className="mt-1 text-xs">Intern</Label>
                  </div>
                  <div className="m-1 flex flex-row gap-2">
                    <Checkbox
                      checked={isProbational}
                      aria-label="Immediate Termination"
                      className="translate-y-[2px]"
                      onCheckedChange={checked => {
                        const isChecked = Boolean(checked);
                        handleProbationalChange(isChecked);
                      }}
                    />
                    <Label className="mt-1 text-xs">Probational</Label>
                  </div>
                </div>
              )}
              {errors.type && (
                <span className="text-sm text-red-500">
                  {`${moduleType} ${errors.type.message}`}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                moduleType === 'Education' && type === 'add'
                  ? AddEducationPending
                  : moduleType === 'Education' && type === 'edit'
                    ? EditEducationPending
                    : moduleType === 'Experience' && type === 'add'
                      ? AddExperiencePending
                      : moduleType === 'Experience' && type === 'edit'
                        ? EditExperiencePending
                        : moduleType === 'Designation' && type === 'add'
                          ? AddDesignationPending
                          : moduleType === 'Designation' && type === 'edit'
                            ? EditDesignationPending
                            : moduleType === 'Feedback' && type === 'add'
                              ? AddFeedbackPending
                              : moduleType === 'Feedback' && type === 'edit'
                                ? EditFeedbackPending
                                : false
              }
            >
              {moduleType === 'Education' && type === 'add'
                ? 'Add'
                : moduleType === 'Education' && type === 'edit'
                  ? 'Edit'
                  : moduleType === 'Experience' && type === 'add'
                    ? 'Add'
                    : moduleType === 'Experience' && type === 'edit'
                      ? 'Edit'
                      : moduleType === 'Designation' && type === 'add'
                        ? 'Add'
                        : moduleType === 'Designation' && type === 'edit'
                          ? 'Edit'
                          : moduleType === 'Feedback' && type === 'add'
                            ? 'Add'
                            : moduleType === 'Feedback' && type === 'edit'
                              ? 'Edit'
                              : null}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
