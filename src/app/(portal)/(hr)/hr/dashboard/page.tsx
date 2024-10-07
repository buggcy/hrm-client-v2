'use client';
import { FunctionComponent } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { useStores } from '@/providers/Store.Provider';

import { AuthStoreType } from '@/stores/auth';

interface HrDashboardmeProps {}

const HrDashboardme: FunctionComponent<HrDashboardmeProps> = () => {
  const { authStore } = useStores() as { authStore: AuthStoreType };

  const { user } = authStore;

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
