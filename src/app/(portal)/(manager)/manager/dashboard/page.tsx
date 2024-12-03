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

import HrDashboardCharts from '@/app/(portal)/(hr)/hr/dashboard/components/HrDashboardCharts';

interface ManagerDashboardProps {}

const ManagerDashboard: FunctionComponent<ManagerDashboardProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Dashboard">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8">
        <Header subheading="Manage your employees, attendance, and more."></Header>
        <HrDashboardCharts />
      </LayoutWrapper>
    </Layout>
  );
};

export default ManagerDashboard;
