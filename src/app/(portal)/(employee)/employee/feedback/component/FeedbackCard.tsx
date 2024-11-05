'use client';
import React, { useEffect, useState } from 'react';

import {
  Clipboard,
  Heart,
  Lightbulb,
  List,
  Megaphone,
  Star,
  ThumbsUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useStores } from '@/providers/Store.Provider';

import { useEmployeeFeedbackQuery } from '@/hooks/hr/useFeedback.hook';
import { useAuthStore } from '@/stores/auth';
import { FeedbackStoreType } from '@/stores/hr/hr-feedback';

import FeedbackForm from './feedbackForm';

import { EmployeeFeedbackList } from '@/types/feedback.types';

const FeedbackCard: React.FC = () => {
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const { data, error, isLoading, isFetching, refetch } =
    useEmployeeFeedbackQuery();
  const { feedbackStore } = useStores() as { feedbackStore: FeedbackStoreType };
  const { setRefetchFeedbackList } = feedbackStore;

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
        <div className="flex justify-center">
          {showForm && selectedFeedback ? (
            <FeedbackForm
              id={selectedFeedback._id}
              questions={selectedFeedback.questions}
              onSubmit={handleFormSubmit}
              onClose={() => setShowForm(false)}
              userId={userId}
              setRefetchFeedbackList={setRefetchFeedbackList}
            />
          ) : data?.data && data?.data?.length > 0 ? (
            <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {data.data.map(feedback => {
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
                    className="flex w-full max-w-[600px] flex-col items-center p-6 shadow-md hover:shadow-lg"
                  >
                    <h3 className="mb-4 text-center text-xl font-semibold text-gray-600 dark:text-gray-300">
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
          ) : (
            <Card className="flex w-full flex-col p-6 shadow-md hover:shadow-lg">
              <p className="mb-4 flex gap-2 text-xl font-semibold text-gray-600 dark:text-white">
                <Megaphone size={34} />{' '}
                <span className="mt-1">Share Your Valuable Feedback!</span>
              </p>

              <p className="mb-2 w-full text-lg font-medium text-gray-600 dark:text-gray-300">
                We are excited to launch a feedback initiative, aiming to
                capture your thoughts and experiences. Stay connected—our
                feedback form is coming soon!
              </p>

              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                Your insights are crucial to us. Join the feedback process and
                help shape improvements that matter to you!
              </p>

              <ul className="mb-4 space-y-2 text-left text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <Clipboard className="mr-2 text-blue-600" size={18} />
                  Quick and easy questions—takes just a few minutes
                </li>
                <li className="flex items-center">
                  <Lightbulb className="mr-2 text-yellow-600" size={18} />
                  Share your thoughts and help us enhance our services
                </li>
                <li className="flex items-center">
                  <ThumbsUp className="mr-2 text-green-600" size={18} />
                  Your feedback directly shapes future improvements
                </li>
                <li className="flex items-center">
                  <Heart className="mr-2 text-red-600" size={18} />
                  Become a part of our community-driven changes
                </li>
                <li className="flex items-center">
                  <Star className="mr-2 text-purple-600" size={18} />
                  Exclusive perks for frequent contributors!
                </li>
              </ul>
            </Card>
          )}
        </div>
      )}
    </>
  );
};

export default FeedbackCard;
