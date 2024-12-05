'use client';
import React, { FunctionComponent, Suspense } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import FeedbackCard from './component/FeedbackCard';

interface Props {}

const Feedback: FunctionComponent<Props> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Feedbacks">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <Suspense fallback={<div>Loading...</div>}>
          <FeedbackCard />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default Feedback;
