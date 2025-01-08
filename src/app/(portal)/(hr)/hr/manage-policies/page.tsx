'use client';
import React, { Suspense } from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import PolicyTable from './components/PolicyTable.components';

export default function ManagePoliciesPage() {
  return (
    <Layout>
      <LayoutHeader title="Manage Policies">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <Suspense fallback={<div>Loading...</div>}>
          <PolicyTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
