'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Button } from '@/components/ui/button';

import EditEmployee from './EditEmployee';

export default function EditEmployeesPage() {
  const router = useRouter();

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader
        title="Edit Employee"
        leftElement={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go Back"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full p-1"
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
      <LayoutWrapper className="flex w-full flex-col gap-4">
        <Header subheading="Every Detail Counts – Make It Right"></Header>
        <Suspense fallback={<div>Loading...</div>}>
          <EditEmployee />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
