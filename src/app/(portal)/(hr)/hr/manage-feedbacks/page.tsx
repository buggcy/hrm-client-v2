'use client';
import React, { Suspense } from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import FeedbackTable from './component/FeedbackTable';

export default function ManageFeedback() {
  return (
    <Layout>
      <LayoutHeader title="Manage Feedbacks">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <FeedbackTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
