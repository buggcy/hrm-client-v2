'use client';
import { FunctionComponent, Suspense } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';

import LeaveHistoryPage from './leaveHistory';

interface LeaveHistoryProps {}

const LeaveHistory: FunctionComponent<LeaveHistoryProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Leave">
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="home" />
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
