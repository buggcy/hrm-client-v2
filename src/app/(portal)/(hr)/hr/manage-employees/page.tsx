'use client';
import React, { Suspense } from 'react';

import Header from '@/components/Header/Header';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import ChartsPage from './components/ChartsPage';
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
        <Header subheading="Transforming employee management into a journey of growth and success."></Header>
        <div className="mb-6">
          <ChartsPage />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <EmployeeTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
