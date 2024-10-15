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

import LeaveApproval from './component/LeaveApproval';

interface HrLeaveRequestsProps {}

const HrLeaveRequests: FunctionComponent<HrLeaveRequestsProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Manage Leave Requests">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1" className="max-w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <LeaveApproval />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default HrLeaveRequests;
