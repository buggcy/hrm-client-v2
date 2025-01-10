'use client';
import React, { useEffect, useState } from 'react';

import { Clipboard, Lightbulb, List, ThumbsUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useEmployeeFeedbackQuery } from '@/hooks/hr/useFeedback.hook';
import { useAuthStore } from '@/stores/auth';

import FeedbackForm from './feedbackForm';
import FeedbackInfoCard from './FeedbackInfoCard';

import { EmployeeFeedbackList } from '@/types/feedback.types';

const FeedbackCard: React.FC = () => {
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const { data, error, isLoading, isFetching, refetch } =
    useEmployeeFeedbackQuery();

  const [showForm, setShowForm] = useState(false);
  const [selectedFeedback, setSelectedFeedback] =
    useState<EmployeeFeedbackList | null>(null);
  const [attemptedFeedbacks, setAttemptedFeedbacks] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    void (async () => {
      await refetch();
    })();
  }, [refetch]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const attempts =
        data?.data?.reduce(
          (acc, feedback) => {
            const isAttempted =
              localStorage.getItem(`feedbackAttempted-${feedback._id}`) ===
              'true';
            acc[feedback._id] = isAttempted;
            return acc;
          },
          {} as { [key: string]: boolean },
        ) || {};

      setAttemptedFeedbacks(attempts);
    }
  }, [data]);

  const handleFeedbackClick = (feedback: EmployeeFeedbackList) => {
    if (!attemptedFeedbacks[feedback._id]) {
      setSelectedFeedback(feedback);
      setShowForm(true);
    }
  };

  const handleFormSubmit = () => {
    if (selectedFeedback) {
      localStorage.setItem(`feedbackAttempted-${selectedFeedback._id}`, 'true');
      setAttemptedFeedbacks(prev => ({
        ...prev,
        [selectedFeedback._id]: true,
      }));
      setShowForm(false);
    }
  };

  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <>
      {isLoading || isFetching ? (
        <Skeleton className="h-8 w-full" />
      ) : (
        <div>
          {showForm && selectedFeedback ? (
            <FeedbackForm
              id={selectedFeedback._id}
              questions={selectedFeedback.questions}
              onSubmit={handleFormSubmit}
              onClose={() => setShowForm(false)}
              userId={userId}
              setRefetchFeedbackList={refetch}
            />
          ) : data?.data?.length === 0 ||
            (data?.data &&
              data?.data?.length > 0 &&
              data.data.every(feedback =>
                feedback.userToAttempted?.includes(userId || ''),
              )) ? (
            <FeedbackInfoCard />
          ) : (
            <div className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-3">
              {data?.data?.map(feedback => {
                const isUserAttempted = feedback?.userToAttempted?.includes(
                  userId || '',
                );
                const isFeedbackAttempted =
                  attemptedFeedbacks[feedback._id] || isUserAttempted;

                if (isFeedbackAttempted) {
                  return null;
                }
                return (
                  <Card
                    key={feedback._id}
                    className="flex w-full max-w-[450px] flex-col items-center p-6"
                  >
                    <h3 className="mb-4 text-center text-xl font-semibold dark:text-gray-300">
                      {feedback.feedbackCategory}
                    </h3>
                    <div className="mb-2 p-1">
                      <h4 className="mb-2 text-base font-semibold text-gray-600 dark:text-gray-300">
                        {feedback.feedbackTitle}
                      </h4>
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                        We value your insights! Participate in our feedback
                        process to help us improve our services. Your opinion
                        matters and can lead to meaningful changes.
                      </p>
                      <ul className="mb-4 space-y-2 text-left text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-center">
                          <Clipboard className="mr-2 text-blue-600" size={18} />
                          Answer a few quick questions
                        </li>
                        <li className="flex items-center">
                          <Lightbulb
                            className="mr-2 text-yellow-600"
                            size={18}
                          />
                          Share your thoughts on our services
                        </li>
                        <li className="flex items-center">
                          <ThumbsUp className="mr-2 text-green-600" size={18} />
                          Your feedback will help shape future improvements
                        </li>
                        <li className="flex items-center">
                          <List className="mr-2 text-gray-600" size={18} />
                          Total Questions: {feedback.questions.length}
                        </li>
                      </ul>
                    </div>
                    <Button
                      variant={'default'}
                      size={'sm'}
                      onClick={() => handleFeedbackClick(feedback)}
                    >
                      Quick Feedback
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FeedbackCard;
