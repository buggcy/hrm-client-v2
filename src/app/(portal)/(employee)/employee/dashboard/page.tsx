'use client';
import { FunctionComponent } from 'react';

import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import RecentAnnouncements from './components/Announcement';
import { BChart } from './components/BarChart/BarChart';
import EmployeeCard from './components/Employeecard';
import UpcomingEvents from './components/UpcomingEvents';
interface EmployeeDashboardProps {}

const EmployeeDashboard: FunctionComponent<EmployeeDashboardProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Dashboard">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-5">
        <div className="m-0 p-0">
          <Header subheading="Have a good day ahead!" />
        </div>
        <div className="flex w-full flex-col items-stretch gap-4 align-middle lg:flex-row">
          <div className="flex size-full h-full flex-col gap-4 lg:w-2/3">
            <EmployeeCard />
            <div className="h-full flex-1">
              <BChart />
            </div>
          </div>

          <div className="grid size-full grid-cols-1 gap-4 md:grid-cols-2 lg:w-1/3 lg:grid-cols-1">
            <UpcomingEvents />
            <RecentAnnouncements />
          </div>
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default EmployeeDashboard;
