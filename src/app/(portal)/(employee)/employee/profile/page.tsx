'use client';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import { useReadEmployeeRecordQuery } from '@/hooks/employee/useEmployeeList.hook';
import { useAuthStore } from '@/stores/auth';

import ProfileComponent from './components/Profile.component';

export default function MyProfile() {
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const { data } = useReadEmployeeRecordQuery(userId as string, {
    enabled: !!userId,
  });

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="My Profile">
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
