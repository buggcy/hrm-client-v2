'use client';

import { FunctionComponent, Suspense } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import HrLeaveListTable from './components/LeaveListTable.component';

interface LeaveListProps {}

const LeaveList: FunctionComponent<LeaveListProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Manage Leaves">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-12 px-2">
        <Suspense fallback={<div>Loading...</div>}>
          <HrLeaveListTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default LeaveList;
