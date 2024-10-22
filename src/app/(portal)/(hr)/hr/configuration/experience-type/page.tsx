'use client';

import { FunctionComponent, Suspense } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import ExperienceTypeTable from './component/ExperienceTypeTable';

interface ExperienceTypeProps {}

const ExperienceType: FunctionComponent<ExperienceTypeProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Manage Experience Type">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-12 px-2">
        <Suspense fallback={<div>Loading...</div>}>
          <ExperienceTypeTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default ExperienceType;
