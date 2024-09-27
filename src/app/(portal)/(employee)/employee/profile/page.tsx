'use client';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';

import { useAuthStore } from '@/stores/auth';

import ProfileComponent from './components/Profile.component';

export default function MyProfile() {
  const { user } = useAuthStore();
  console.log('Logged-in user: ', user);

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="My Profile">
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="home" />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <h1>Hallo Profile!</h1>
        <ProfileComponent user={user} />
      </LayoutWrapper>
    </Layout>
  );
}
