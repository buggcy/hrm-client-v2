'use client';
import { FunctionComponent } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon/NotificationIcon';

interface EmployeeDashboardProps {}

const EmployeeDashboard: FunctionComponent<EmployeeDashboardProps> = () => {
  const authStorage = sessionStorage.getItem('auth-storage');
  let user = null;

  if (authStorage) {
    const parsedStorage = JSON.parse(authStorage);
    user = parsedStorage.state?.user;
  }

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Dashboard">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <h1>
          Welcome Back !{' '}
          <span className="font-bold capitalize">
            {user.firstName} {user.lastName}
          </span>
        </h1>
      </LayoutWrapper>
    </Layout>
  );
};

export default EmployeeDashboard;
