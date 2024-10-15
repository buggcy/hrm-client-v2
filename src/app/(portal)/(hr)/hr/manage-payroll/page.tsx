'use client';

import React, { Suspense } from 'react';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
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
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  return (
    <Layout>
      <LayoutHeader title="Manage Payroll">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Header subheading="Swift payroll, zero stress, happier employees.">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
        </Header>

        <div className="mt-6">
          <Suspense fallback={<div>Loading...</div>}>
            <PayrollTable dates={selectedDate} />
          </Suspense>
        </div>
      </LayoutWrapper>
    </Layout>
  );
}
