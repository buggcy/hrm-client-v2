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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <EmployeeCard />
            <div className="flex-1">
              <BChart />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <RecentAnnouncements />
            <UpcomingEvents />
          </div>
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default EmployeeDashboard;
