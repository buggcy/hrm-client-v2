'use client';
import { FunctionComponent, useEffect, useState } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon/NotificationIcon';

import { User } from '@/types/user.types';
interface EmployeeDashboardProps {}

const EmployeeDashboard: FunctionComponent<EmployeeDashboardProps> = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authStorage = sessionStorage.getItem('auth-storage');

      if (authStorage) {
        const parsedStorage = JSON.parse(authStorage) as {
          state?: { user?: User };
        };
        const userData = parsedStorage.state?.user;
        if (
          userData &&
          typeof userData.firstName === 'string' &&
          typeof userData.lastName === 'string'
        ) {
          setUser(userData);
        } else {
          setUser(null);
        }
      }
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
        {user ? (
          <h1>
            Welcome Back!{' '}
            <span className="font-bold capitalize">
              {user.firstName} {user.lastName}
            </span>
          </h1>
        ) : (
          <h1>Welcome Back!</h1>
        )}
      </LayoutWrapper>
    </Layout>
  );
};

export default EmployeeDashboard;
