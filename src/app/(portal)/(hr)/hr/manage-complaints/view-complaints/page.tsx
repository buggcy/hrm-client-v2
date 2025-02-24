'use client';

import { FunctionComponent, Suspense } from 'react';
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

import ComplaintResolved from './component/ComplaintResolved';

interface Props {}

const HrViewComplaint: FunctionComponent<Props> = () => {
  const router = useRouter();
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader
        title="View Complaints"
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
      <LayoutWrapper wrapperClassName="flex flex-1" className="max-w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <ComplaintResolved />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default HrViewComplaint;
