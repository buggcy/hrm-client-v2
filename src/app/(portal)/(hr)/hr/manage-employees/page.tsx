'use client';
import React, { Suspense } from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import { BChart } from './BarChart/BarChart';
import EmployeeTable from './components/EmployeeTable.component';
import { PChart } from './PieChart/PieChart';

export default function ManageEmployeesPage() {
  return (
    <Layout>
      <LayoutHeader title="Manage Employees">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BChart /> <PChart />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <EmployeeTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
