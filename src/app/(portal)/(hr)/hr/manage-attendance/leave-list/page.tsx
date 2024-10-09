'use client';

import { FunctionComponent } from 'react';

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

import { LeavesDistributionChart } from './components/charts/leaves-distribution';
import { LeavesTrendChart } from './components/charts/leaves-trend';

interface HrAttendanceListProps {}

const HrLeaveList: FunctionComponent<HrAttendanceListProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Attendance">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-12 px-2">
        <Header subheading="You are 15 minutes late today!">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
        </Header>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <LeavesTrendChart />
          <LeavesDistributionChart />
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default HrLeaveList;
