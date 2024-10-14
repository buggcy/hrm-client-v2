import React, { Suspense } from 'react';

import Header from '@/components/Header/Header';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import PayrollTable from './components/PayrollTable.component';

export default function ManagePayrollPage() {
  return (
    <Layout>
      <LayoutHeader title="Manage Payroll">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Header subheading="Swift payroll, zero stress, happier employees."></Header>

        <div className="mt-6">
          <Suspense fallback={<div>Loading...</div>}>
            <PayrollTable />
          </Suspense>
        </div>
      </LayoutWrapper>
    </Layout>
  );
}
