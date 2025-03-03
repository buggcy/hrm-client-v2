'use client';
import React, { Suspense } from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import ResignedFiredEmployeeTable from './component/ResignedFiredTable';

export default function AddEmployeesPage() {
  return (
    <Layout>
      <LayoutHeader title="Resigned / Fired Employees">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <div className="my-6">
          <Suspense fallback={<div>Loading...</div>}>
            <ResignedFiredEmployeeTable />
          </Suspense>
        </div>
      </LayoutWrapper>
    </Layout>
  );
}
