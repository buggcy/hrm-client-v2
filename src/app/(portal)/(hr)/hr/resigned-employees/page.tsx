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

import ResignedApproval from './components/ResignedApproval';
import ResignedListTable from './components/ResignedTable';

export default function ResignedEmployeesPage() {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

  return (
    <Layout>
      <LayoutHeader title="Resigned Employees">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1" className="mb-5 max-w-full">
        <Header subheading="Easily Track and Approve Employee Resignation Requests!">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
        </Header>
        <Suspense fallback={<div>Loading...</div>}>
          <ResignedApproval selectedDate={selectedDate} />
        </Suspense>
      </LayoutWrapper>
      <LayoutWrapper wrapperClassName="flex flex-1 mt-5">
        <Suspense fallback={<div>Loading...</div>}>
          <ResignedListTable selectedDate={selectedDate} />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
