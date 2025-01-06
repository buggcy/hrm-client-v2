'use client';
import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ChevronDown, Plus, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import CustomDayPicker from '@/components/CustomDayPicker';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

import { useTypesQuery } from '@/hooks/types.hook';
import { FeedbackType } from '@/libs/validations/hr-feedback';
import {
  addFeedback,
  Editbody,
  updateFeedback,
} from '@/services/hr/hr-feedback.service';
import { useAuthStore } from '@/stores/auth';

import { MessageErrorResponse } from '@/types';

interface ModalProps {
  open: boolean;
  type: string;
  onCloseChange: (open: boolean) => void;
  selectedRow?: FeedbackType | null;
  setRefetchFeedbackList: (refetch: boolean) => void;
}

const FormSchema = z.object({
  title: z.string().min(1, 'Feedback title is required'),
  category: z.string().min(1, 'Please select a category'),
  questionText: z.string().optional(),
  questions: z.array(z.string()).min(1, 'At least one question is required'),
  deleteQuestions: z.array(z.string()).optional(),
  startDate: z.date(),
  endDate: z.date(),
});

export type FormData = z.infer<typeof FormSchema>;

export function AddEditFeedbackModal({
  open,
  onCloseChange,
  type,
  selectedRow,
  setRefetchFeedbackList,
}: ModalProps) {
  const [initialQuestions, setInitialQuestions] = useState<string[]>([]);
  const { data: types } = useTypesQuery();
  const [isContinue, setIsContinue] = useState<boolean>(false);

  const { user } = useAuthStore();
  const userId = user?.id;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    setError,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      category: '',
      questions: [],
      questionText: '',
      deleteQuestions: [],
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const questions = watch('questions');
  const questionText = watch('questionText');
  useEffect(() => {
    if (open && type === 'edit' && selectedRow) {
      setValue('title', selectedRow.feedbackTitle || '');
      setValue('category', selectedRow.feedbackCategory || '');
      const existingQuestions = selectedRow.questions.map(
        question => question.questionText,
      );
      setValue(
        'startDate',
        selectedRow?.startDate ? new Date(selectedRow?.startDate) : new Date(),
      );
      setValue(
        'endDate',
        selectedRow?.endDate ? new Date(selectedRow?.endDate) : new Date(),
      );
      if (selectedRow?.isContinue) {
        setIsContinue(selectedRow?.isContinue);
      }
      setValue('questions', existingQuestions);
      setInitialQuestions(existingQuestions);
    } else if (!open) {
      reset();
      setIsContinue(false);
      setInitialQuestions([]);
    }
  }, [open, reset, setValue, type, selectedRow]);

  const handleAddQuestion = () => {
    const questionText = getValues('questionText') || '';
    if (questionText.trim()) {
      setValue('questions', [...getValues('questions'), questionText]);
      setValue('questionText', '');
    }
  };

  const handleRemoveQuestion = (index: number, questionId?: string) => {
    const updatedQuestions = getValues('questions').filter(
      (_, i) => i !== index,
    );
    setValue('questions', updatedQuestions);

    const currentDeleteQuestions = getValues('deleteQuestions') || [];
    if (questionId) {
      setValue('deleteQuestions', [...currentDeleteQuestions, questionId]);
    }
  };
  const handleCheckboxChange = (checked: boolean) => {
    setIsContinue(checked);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addFeedback,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Feedback Add Successfully!',
        variant: 'success',
      });
      reset();
      setRefetchFeedbackList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on adding feedbacks!',
        variant: 'error',
      });
    },
  });
  const { mutate: EditMutate, isPending: EditPending } = useMutation({
    mutationFn: updateFeedback,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Feedback Update Successfully!',
        variant: 'success',
      });
      reset();
      setRefetchFeedbackList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on editing feedbacks!',
        variant: 'error',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const newQuestions = data.questions.filter(
      question => !initialQuestions.includes(question),
    );
    if (!isContinue && data.startDate > data.endDate) {
      setError('endDate', {
        type: 'manual',
        message: 'End date should be greater than or equal to the start date!',
      });
      return;
    }
    if (type === 'add') {
      const addPayload = {
        body: {
          hr: userId || '',
          feedbackTitle: data?.title,
          question: data?.questions,
          feedbackCategory: data?.category,
          startDate: data?.startDate
            ? new Date(data.startDate).toISOString().split('T')[0]
            : '',
          endDate: isContinue
            ? undefined
            : data?.endDate
              ? new Date(data.endDate).toISOString().split('T')[0]
              : '',
          isContinue,
          isSuggestion: true,
        },
      };
      mutate(addPayload);
    }

    if (type === 'edit') {
      const editPayload: {
        id: string;
        body: Editbody;
      } = {
        id: selectedRow?._id || '',
        body: {
          feedbackTitle: data?.title,
          feedbackCategory: data?.category,
          isContinue,
          startDate: data?.startDate
            ? new Date(data.startDate).toISOString().split('T')[0]
            : '',
          endDate: data?.endDate
            ? new Date(data.endDate).toISOString().split('T')[0]
            : '',
        },
      };

      if (newQuestions.length > 0) {
        editPayload.body.question = newQuestions;
      }

      if (data.deleteQuestions && data.deleteQuestions.length > 0) {
        editPayload.body.deleteQuestions = data.deleteQuestions;
      }

      EditMutate(editPayload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'edit' ? 'Update Feedback' : 'Add Feedback'}
          </DialogTitle>
        </DialogHeader>
        <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="title" className="mb-2 text-left">
                Feedback Title
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="title"
                    placeholder="Enter Feedback title..."
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
          </div>
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="category" className="mb-2 text-left">
                Feedback Category
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={value => field.onChange(value)}
                  >
                    <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        {types?.feedbackType.map((type, index) => (
                          <SelectItem key={index} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                  </Select>
                )}
              />
              {errors.category && (
                <span className="text-sm text-red-500">
                  {errors.category.message}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-2">
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
              {errors?.endDate && (
                <span className="text-sm text-red-500">
                  {errors?.endDate?.message}
                </span>
              )}
              <div className="m-1 flex flex-row gap-2">
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
          </div>
          <div className="flex flex-col flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="questionText" className="mb-2 text-left">
                Add Questions
              </Label>
              <div className="relative flex flex-row justify-between">
                <Controller
                  name="questionText"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="questionText"
                      placeholder="Write question..."
                      className="w-full"
                      {...field}
                    />
                  )}
                />
                <Button
                  type="button"
                  className="absolute right-0 top-0 h-full px-2 py-1"
                  size="sm"
                  variant={`${questionText?.trim() ? 'default' : 'card'}`}
                  onClick={handleAddQuestion}
                  disabled={!questionText?.trim()}
                >
                  <Plus />
                </Button>
              </div>
            </div>
            {errors.questions && questions.length === 0 && (
              <span className="text-sm text-red-500">
                {errors.questions.message}
              </span>
            )}
            {questions.length > 0 && (
              <ScrollArea className="mt-2 h-16 w-full">
                <div className="mt-1 flex flex-col space-y-2">
                  {questions.map((question, index) => (
                    <div key={index} className="flex rounded-md p-1 text-xs">
                      <span>
                        {index + 1}. {question}
                      </span>
                      <X
                        className="ml-3 size-4 cursor-pointer text-red-600"
                        onClick={() =>
                          handleRemoveQuestion(
                            index,
                            selectedRow?.questions[index]?._id,
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              size="sm"
              disabled={type === 'add' ? isPending : EditPending}
            >
              {type === 'edit' ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
