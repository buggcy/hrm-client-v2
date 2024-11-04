'use client';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useStores } from '@/providers/Store.Provider';

import { useEmployeeFeedbackQuery } from '@/hooks/hr/useFeedback.hook';
import { useAuthStore } from '@/stores/auth';
import { FeedbackStoreType } from '@/stores/hr/hr-feedback';

import FeedbackForm from './feedbackForm';

interface Feedbacks {
  _id: string;
  feedbackTitle: string;
  feedbackCategory: string;
  questions: Array<{ _id: string; questionText: string; timestamp: string }>;
}

const FeedbackCard: React.FC = () => {
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const { data } = useEmployeeFeedbackQuery();
  const { feedbackStore } = useStores() as { feedbackStore: FeedbackStoreType };
  const { setRefetchFeedbackList } = feedbackStore;

  const [showForm, setShowForm] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedbacks | null>(
    null,
  );
  const [attemptedFeedbacks, setAttemptedFeedbacks] = useState<{
    [key: string]: boolean;
  }>({});

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

  const handleFeedbackClick = (feedback: Feedbacks) => {
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

  return (
    <div className="flex justify-center p-4">
      {showForm && selectedFeedback ? (
        <FeedbackForm
          title={selectedFeedback.feedbackTitle}
          id={selectedFeedback._id}
          questions={selectedFeedback.questions}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
          userId={userId}
          setRefetchFeedbackList={setRefetchFeedbackList}
        />
      ) : data?.data && data?.data?.length > 0 ? (
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.data?.map(feedback => {
            const isUserAttempted = feedback?.userToAttempted?.includes(
              userId || '',
            );
            const isFeedbackAttempted =
              attemptedFeedbacks[feedback._id] || isUserAttempted;
            return (
              <Card
                key={feedback._id}
                className="flex flex-col items-center p-6 shadow-md hover:shadow-lg"
              >
                <h3 className="mb-4 text-center text-xl font-semibold text-gray-600 dark:text-gray-300">
                  {feedback.feedbackCategory}
                </h3>
                <Button
                  variant={isFeedbackAttempted ? 'card' : 'default'}
                  size={'sm'}
                  onClick={() => handleFeedbackClick(feedback)}
                  disabled={isFeedbackAttempted}
                >
                  {isFeedbackAttempted
                    ? 'Feedback Submitted'
                    : 'Quick Feedback'}
                </Button>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="w-full text-base font-medium text-gray-600 dark:text-gray-300">
          We are preparing a feedback to conduct user thoughts and experiences.
          Please connect with us, stay tuned! The feedback form will air soon.
        </p>
      )}
    </div>
  );
};

export default FeedbackCard;
