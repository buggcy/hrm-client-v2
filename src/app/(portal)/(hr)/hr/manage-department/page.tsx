'use client';
import React, { Suspense } from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import DepartmentTable from './component/DepartmentTable';

export default function ManageDepartment() {
  return (
    <Layout>
      <LayoutHeader title="Manage Departments">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <DepartmentTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
