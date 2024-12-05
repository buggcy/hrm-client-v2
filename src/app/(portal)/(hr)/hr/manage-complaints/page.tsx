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

import HrComplaintTable from './component/HrComplaintTable';

interface ManageComplaintProps {}

const ManageComplaint: FunctionComponent<ManageComplaintProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Manage Complaint">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-12 px-2">
        <Suspense fallback={<div>Loading...</div>}>
          <HrComplaintTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default ManageComplaint;
