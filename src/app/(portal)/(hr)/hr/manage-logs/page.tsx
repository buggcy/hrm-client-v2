'use client';

import { FunctionComponent, Suspense } from 'react';

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

import LogsTable from './component/LogsTable.component';

interface LogsListProps {}

const LogsList: FunctionComponent<LogsListProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Manage Logs">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-12 px-2">
        <Header subheading="Log Entry: Employee marked 15 minutes late today.">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
        </Header>
        <Suspense fallback={<div>Loading....</div>}>
          <LogsTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default LogsList;
