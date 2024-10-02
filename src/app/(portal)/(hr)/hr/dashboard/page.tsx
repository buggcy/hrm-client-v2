'use client';
import { FunctionComponent, useEffect, useState } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import { User } from '@/types/user.types';

interface HrDashboardmeProps {}

const HrDashboardme: FunctionComponent<HrDashboardmeProps> = () => {
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);

  useEffect(() => {
    const authStorage = sessionStorage.getItem('auth-storage');
    if (authStorage) {
      const parsedStorage = JSON.parse(authStorage);
      const userData: User = parsedStorage.state?.user;
      setUser(userData || null);
    }
  }, []);

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
          Welcome Back!{' '}
          {user ? (
            <span className="font-bold capitalize">
              {user.firstName} {user.lastName}
            </span>
          ) : (
            'User'
          )}
        </h1>
      </LayoutWrapper>
    </Layout>
  );
};

export default HrDashboardme;
