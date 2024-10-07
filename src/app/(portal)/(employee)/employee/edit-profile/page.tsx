'use client';
import React from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import { useAuthStore } from '@/stores/auth';

import EditProfileComponent from './component/EditProfile';

const EditProfile = () => {
  const { user } = useAuthStore();

  return (
    <>
      {' '}
      <Layout>
        <HighTrafficBanner />
        <LayoutHeader title="Edit Profile">
          <LayoutHeaderButtonsBlock>
            <Notification />
          </LayoutHeaderButtonsBlock>
        </LayoutHeader>
        <LayoutWrapper className="flex flex-col gap-10">
          {user && <EditProfileComponent user={user} />}
        </LayoutWrapper>
      </Layout>
    </>
  );
};

export default EditProfile;
