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

import ComplaintTable from './component/ComplaintTable';

interface ComplaintProps {}

const Complaint: FunctionComponent<ComplaintProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Complaint">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <Suspense fallback={<div>Loading...</div>}>
          <ComplaintTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default Complaint;
