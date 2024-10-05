'use client';
import { FunctionComponent, Suspense } from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import LeaveHistoryPage from './leaveHistory';

interface LeaveHistoryProps {}

const LeaveHistory: FunctionComponent<LeaveHistoryProps> = () => {
  return (
    <Layout>
      <LayoutHeader title="Leave">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <LeaveHistoryPage />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default LeaveHistory;
