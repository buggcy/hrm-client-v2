'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Button } from '@/components/ui/button';

import { useAuthStore } from '@/stores/auth';

import EditProfileComponent from './component/EditProfile';

const EditProfile = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <>
      {' '}
      <Layout>
        <HighTrafficBanner />
        <LayoutHeader
          title="Edit Profile"
          leftElement={
            <Button
              variant="outline"
              size="icon"
              aria-label="Go Back"
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 p-1"
              onClick={() => router.back()}
            >
              <ArrowLeft className="size-5" />
            </Button>
          }
        >
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
