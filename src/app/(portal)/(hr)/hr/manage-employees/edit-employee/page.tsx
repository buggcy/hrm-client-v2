'use client';

import { Suspense } from 'react';

import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import EditEmployee from './EditEmployee';

export default function EditEmployeesPage() {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Edit Employee">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex w-full flex-col gap-4">
        <Header subheading="Edit Employee"></Header>
        <Suspense fallback={<div>Loading...</div>}>
          <EditEmployee />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
