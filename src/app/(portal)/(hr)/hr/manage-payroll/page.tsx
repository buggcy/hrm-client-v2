'use client';

import React, { Suspense } from 'react';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import PayrollCard from './component/PayrollCard';
import PayrollTable from './components/PayrollTable.component';

export default function ManagePayrollPage() {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

  const defaultDate = new Date();
  const month = selectedDate?.from
    ? selectedDate.from.getMonth() + 1
    : defaultDate.getMonth() + 1;
  const year = selectedDate?.from
    ? selectedDate.from.getFullYear().toString()
    : defaultDate.getFullYear().toString();

  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  return (
    <Layout>
      <HighTrafficBanner />
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
            <PayrollCard formattedMonth={formattedMonth} year={year} />
          </Suspense>
        </div>

        <div className="mt-6">
          <Suspense fallback={<div>Loading...</div>}>
            <PayrollTable dates={selectedDate} />
          </Suspense>
        </div>
      </LayoutWrapper>
    </Layout>
  );
}
