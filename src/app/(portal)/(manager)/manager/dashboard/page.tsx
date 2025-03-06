'use client';
import { FunctionComponent } from 'react';

import moment from 'moment';

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

import ManagerDashboardCharts from './components/Charts.component';

interface ManagerDashboardProps {}

const ManagerDashboard: FunctionComponent<ManagerDashboardProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const from = moment(selectedDate?.from).format('YYYY-MM-DD');
  const to = moment(selectedDate?.to).format('YYYY-MM-DD');
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Dashboard">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8">
        <Header subheading="Manage your employees, attendance, and more.">
          <div className="flex flex-wrap">
            <DateRangePicker
              timeRange={timeRange}
              selectedDate={selectedDate}
              setTimeRange={setTimeRange}
              setDate={handleSetDate}
            />
          </div>
        </Header>
        <ManagerDashboardCharts from={from} to={to} />
      </LayoutWrapper>
    </Layout>
  );
};

export default ManagerDashboard;
