'use client';
import React, { Suspense } from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import EmployeeTable from './components/EmployeeTable.component';

export default function ManageEmployeesPage() {
  return (
    <Layout>
      <LayoutHeader title="Manage Employees">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <EmployeeTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
