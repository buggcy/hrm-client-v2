'use client';
import React, { Suspense } from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import LogTable from './component/LogsTable';

export default function ManageLeavePage() {
  return (
    <Layout>
      <LayoutHeader title="Manage Logs">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <LogTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
