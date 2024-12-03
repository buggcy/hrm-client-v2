'use client';
import React from 'react';

import {
  Clipboard,
  Heart,
  Lightbulb,
  Megaphone,
  Star,
  ThumbsUp,
} from 'lucide-react';

import { Card } from '@/components/ui/card';

const FeedbackInfoCard = () => {
  return (
    <Card className="flex flex-col p-6 shadow-md hover:shadow-lg">
      <p className="mb-4 flex gap-2 text-xl font-semibold text-gray-600 dark:text-white">
        <Megaphone size={34} />{' '}
        <span className="mt-1">Share Your Valuable Feedback!</span>
      </p>

      <p className="mb-2 w-full text-lg font-medium text-gray-600 dark:text-gray-300">
        We are excited to launch a feedback initiative, aiming to capture your
        thoughts and experiences. Stay connected—our feedback form is coming
        soon!
      </p>

      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        Your insights are crucial to us. Join the feedback process and help
        shape improvements that matter to you!
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
  );
};

export default FeedbackInfoCard;
