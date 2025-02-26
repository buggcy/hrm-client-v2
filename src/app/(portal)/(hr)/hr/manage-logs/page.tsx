'use client';
import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Button } from '@/components/ui/button';

import LogTable from './component/LogsTable';

export default function ManageLeavePage() {
  const router = useRouter();
  return (
    <Layout>
      <LayoutHeader
        title="Manage Logs"
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
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <LogTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
