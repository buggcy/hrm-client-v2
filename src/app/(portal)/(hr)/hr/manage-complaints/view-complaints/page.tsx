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

import ComplaintResolved from './component/ComplaintResolved';

interface Props {}

const HrViewComplaint: FunctionComponent<Props> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="View Complaints">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1" className="max-w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <ComplaintResolved />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default HrViewComplaint;
