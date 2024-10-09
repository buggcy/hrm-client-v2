'use client';
import { useSearchParams } from 'next/navigation';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { useStores } from '@/providers/Store.Provider';

import { useReadEmployeeRecordQuery } from '@/hooks/employee/useEmployeeList.hook';
import { AuthStoreType } from '@/stores/auth';

import ProfileComponent from './components/Profile.component';

export default function MyProfile() {
  const searchParams = useSearchParams();
  const userIdFromParams = searchParams.get('userId');

  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const userId = userIdFromParams || user?.id;

  const { data } = useReadEmployeeRecordQuery(userId as string, {
    enabled: !!userId,
  });

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title={userIdFromParams ? 'Employee Detail' : 'My Profile'}>
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        {user && <ProfileComponent user={data} currentUser={user} />}
      </LayoutWrapper>
    </Layout>
  );
}
