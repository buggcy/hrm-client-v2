'use client';
import React, { Suspense } from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import UnApprovedEmployeeTable from './components/UnapprovedEmployee.component';

export default function AddEmployeesPage() {
  return (
    <Layout>
      <LayoutHeader title="Add Employees">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <UnApprovedEmployeeTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
