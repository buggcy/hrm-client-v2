'use client';

import { Suspense } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import EditEmployee from './EditEmployee';

export default function Page() {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Add Perks">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex max-w-full flex-col gap-8 px-2">
        <Suspense fallback={<div>Loading...</div>}>
          <EditEmployee />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
