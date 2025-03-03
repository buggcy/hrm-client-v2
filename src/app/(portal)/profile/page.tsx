'use client';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

import ProfileMain from './components/ProfileMain';

export default function MyProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdFromParams =
    typeof window !== 'undefined' ? searchParams.get('userId') : null;
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader
        title={userIdFromParams ? 'View Profile' : 'My Profile'}
        {...(userIdFromParams && {
          leftElement: (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Go Back"
              className="flex size-10 cursor-pointer items-center justify-center rounded-full p-1"
              onClick={() => router.back()}
            >
              <ArrowLeft className="size-5" />
            </Button>
          ),
        })}
      >
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
