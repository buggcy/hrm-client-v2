import { Suspense } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import ProfileMain from './components/ProfileMain';

export default function MyProfile() {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title={'My Profile'}>
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <Suspense fallback={<div>Loading...</div>}>
          <ProfileMain />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
