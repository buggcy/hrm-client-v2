'use client';
import { FunctionComponent } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';

import RecentAnnouncements from './components/Announcement';
import { BChart } from './components/BarChart/BarChart';
import BirthdaysUpcoming from './components/Birthdays';
import DashboardHeader from './components/dashboardHeader';
import EmployeeCard from './components/Employeecard';
import UpcomingEvents from './components/UpcomingEvents';

interface EmployeeDashboardProps {}

const EmployeeDashboard: FunctionComponent<EmployeeDashboardProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Dashboard">
        <LayoutHeaderButtonsBlock>
          <button className="text-black">View Docs</button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-5">
        <div className="m-0 p-0">
          <DashboardHeader />
        </div>
        <div className="flex flex-col items-start gap-5 lg:flex-row">
          <div className="w-full lg:w-2/3">
            <EmployeeCard />
          </div>
          <div className="w-full lg:w-1/3">
            <RecentAnnouncements />
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
          <div className="w-full lg:w-2/3">
            <BChart />
          </div>
          <div className="w-full lg:w-1/3">
            <UpcomingEvents />
            <BirthdaysUpcoming />
          </div>
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default EmployeeDashboard;
