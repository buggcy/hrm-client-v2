'use client';
import React, { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { CheckCircle2, Circle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioInput } from '@/components/ui/radio';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

import { addAnswer } from '@/services/hr/hr-feedback.service';

import { MessageErrorResponse } from '@/types';
import { Questions } from '@/types/feedback.types';

interface FeedbackFormProps {
  questions: Questions[];
  onSubmit: () => void;
  onClose: () => void;
  userId?: string;
  id: string;
  setRefetchFeedbackList: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  questions,
  onSubmit,
  onClose,
  userId,
  id,
  setRefetchFeedbackList,
}) => {
  const [answers, setAnswers] = useState<
    { questionId: string; answerText: string }[]
  >([]);

  const handleOptionChange = (questionId: string, answer: string) => {
    setAnswers(prevAnswers => {
      const existingAnswerIndex = prevAnswers.findIndex(
        answer => answer.questionId === questionId,
      );
      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex].answerText = answer;
        return updatedAnswers;
      } else {
        return [...prevAnswers, { questionId, answerText: answer }];
      }
    });
  };

  const handleTextareaChange = (questionId: string, text: string) => {
    setAnswers(prevAnswers => {
      const existingAnswerIndex = prevAnswers.findIndex(
        answer => answer.questionId === questionId,
      );
      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex].answerText = text;
        return updatedAnswers;
      } else {
        return [...prevAnswers, { questionId, answerText: text }];
      }
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addAnswer,
    onSuccess: response => {
      toast({
        title: 'Success',
        description:
          response?.message || 'Thank You! Your response has been recorded.',
        variant: 'success',
      });
      setRefetchFeedbackList();
      onSubmit();
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on submitting feedback form!',
        variant: 'error',
      });
    },
  });

  const handleSubmit = () => {
    const payload = {
      id,
      body: {
        userId: userId || '',
        answer: answers,
      },
    };
    mutate(payload);
  };

  return (
    <Card className="relative w-full p-6">
      <X
        className="absolute right-3 top-3 size-4 cursor-pointer"
        onClick={onClose}
      />
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-center text-2xl font-bold dark:text-white">
          Feedback Form
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Q. No.</TableHead>
              <TableHead className="w-[640px]">Questions</TableHead>
              <TableHead>Excellent</TableHead>
              <TableHead>Very Good</TableHead>
              <TableHead>Good</TableHead>
              <TableHead>Average</TableHead>
              <TableHead>Below Average</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.slice(0, -1).map((question, index) => (
              <TableRow key={question._id}>
                <TableCell className="border px-4 py-2 text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="border px-4 py-2">
                  {question.questionText}
                </TableCell>
                {[
                  'Excellent',
                  'Very Good',
                  'Good',
                  'Average',
                  'Below Average',
                ].map(option => (
                  <TableCell
                    key={option}
                    className="cursor-pointer border px-4 py-2 text-center"
                    onClick={() => handleOptionChange(question._id, option)}
                  >
                    {answers.find(
                      answer =>
                        answer.questionId === question._id &&
                        answer.answerText === option,
                    ) ? (
                      <div className="flex justify-center align-middle">
                        <CheckCircle2 />
                      </div>
                    ) : (
                      <div className="relative flex justify-center align-middle">
                        <RadioInput
                          id={`question-${question._id}-${option}`}
                          name={`question-${question._id}`}
                          value={option}
                          checked={
                            answers.find(
                              answer => answer.questionId === question._id,
                            )?.answerText === option
                          }
                          onChange={() =>
                            handleOptionChange(question._id, option)
                          }
                          className="hidden"
                          label={''}
                        />
                        <Circle />
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Separator />
        <div className="w-full">
          <div className="mt-2 flex w-full flex-col gap-4 md:flex-row">
            <div className="w-full md:w-5/12 lg:w-5/12">
              <span className="ml-1 text-gray-600 dark:text-white">
                {questions[questions?.length - 1].questionText}
              </span>
            </div>
            <div className="w-full md:w-7/12 lg:w-7/12">
              <Textarea
                value={
                  answers.find(
                    answer =>
                      answer.questionId === questions[questions.length - 1]._id,
                  )?.answerText || ''
                }
                placeholder="Please share your feedback here..."
                onChange={e =>
                  handleTextareaChange(
                    questions[questions.length - 1]._id,
                    e.target.value,
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-end">
        <Button onClick={handleSubmit} disabled={isPending} size={'sm'}>
          Submit
        </Button>
      </div>
    </Card>
  );
};

export default FeedbackForm;
