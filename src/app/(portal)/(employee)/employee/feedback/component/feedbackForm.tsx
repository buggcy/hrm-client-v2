'use client';
import React, { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioInput } from '@/components/ui/radio';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

import { addAnswer } from '@/services/hr/hr-feedback.service';

import { MessageErrorResponse } from '@/types';
import { Questions } from '@/types/feedback.types';

interface FeedbackFormProps {
  title: string;
  questions: Questions[];
  onSubmit: () => void;
  onClose: () => void;
  userId?: string;
  id: string;
  setRefetchFeedbackList: (refetch: boolean) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  title,
  questions,
  onSubmit,
  onClose,
  userId,
  id,
  setRefetchFeedbackList,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
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

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
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
      onSubmit();
      setRefetchFeedbackList(true);
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

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const hasAnswer = answers.some(
    answer => answer.questionId === currentQuestion._id,
  );

  return (
    <>
      <div className="flex w-full flex-col gap-8 p-4 md:flex-row">
        <div className="flex flex-col items-center justify-center space-y-4 text-xl font-semibold md:w-1/2">
          <h3 className="text-lg">{title}</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
            <li>Tell us about your experience with our service.</li>
            <li>Share what you loved and what we can improve.</li>
            <li>Your feedback helps us serve you better every day!</li>
          </ul>
        </div>

        <Card className="relative p-6 md:w-1/2">
          <X
            className="absolute right-3 top-3 size-4 cursor-pointer"
            onClick={onClose}
          />
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-center text-2xl font-bold dark:text-white">
              Let’s Start!
            </h2>

            <div className="text-lg font-medium text-gray-600 dark:text-gray-300">
              {`${currentQuestionIndex + 1}. ${currentQuestion.questionText}`}
            </div>

            {currentQuestionIndex < questions.length - 1 ? (
              <div className="flex w-full flex-col gap-3">
                {['Average', 'Good', 'Excellent', 'Not Satisfied'].map(
                  option => (
                    <RadioInput
                      key={option}
                      id={`question-${currentQuestion._id}-${option}`}
                      name={`question-${currentQuestion._id}`}
                      value={option}
                      checked={
                        answers.find(
                          answer => answer.questionId === currentQuestion._id,
                        )?.answerText === option
                      }
                      onChange={() =>
                        handleOptionChange(currentQuestion._id, option)
                      }
                      label={option}
                    />
                  ),
                )}
              </div>
            ) : (
              <Textarea
                value={
                  answers.find(
                    answer => answer.questionId === currentQuestion._id,
                  )?.answerText || ''
                }
                placeholder="Please share your feedback here..."
                onChange={e =>
                  handleTextareaChange(currentQuestion._id, e.target.value)
                }
              />
            )}
            <div className="mt-4 text-xs text-gray-600 dark:text-gray-300">
              {currentQuestionIndex + 1} out of {questions.length}
            </div>

            <div className="mt-4 flex justify-center gap-4">
              {currentQuestionIndex > 0 && (
                <Button
                  onClick={handlePrev}
                  className="bg-gray-300 text-gray-600 hover:bg-gray-300"
                >
                  Previous
                </Button>
              )}
              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-300"
                >
                  Submit
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={!hasAnswer}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default FeedbackForm;
