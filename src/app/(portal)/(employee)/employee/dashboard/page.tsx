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
          <button className="text-black">Notifications</button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-5">
        <div className="m-0 p-0">
          <Header subheading="Have a good day ahead!" />
        </div>
        <div className="flex w-full flex-col items-stretch gap-4 align-middle lg:flex-row">
          <div className="w-full gap-4 lg:w-2/3">
            <EmployeeCard />
            <div className="mt-4">
              <BChart />
            </div>
          </div>
          <div className="size-full lg:w-1/3">
            <RecentAnnouncements />
            <UpcomingEvents />
          </div>
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default EmployeeDashboard;
