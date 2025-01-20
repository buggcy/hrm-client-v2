'use client';
import React, { Suspense } from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import EmployeeList from './component/EmployeeList';

export default function ManageLeavePage() {
  return (
    <Layout>
      <LayoutHeader title="Manage Leave">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <EmployeeList />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
