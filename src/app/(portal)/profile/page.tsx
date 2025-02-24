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
import { ApprovalActions } from '../(hr)/hr/approval/ApprovalCard/ApprovalButtons';

export default function MyProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showActions = searchParams.get('showActions') === 'true';
  const employeeId = searchParams.get('employeeId');

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader
        title={'My Profile'}
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
          {showActions && employeeId && (
            <ApprovalActions employeeId={employeeId} />
          )}
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
