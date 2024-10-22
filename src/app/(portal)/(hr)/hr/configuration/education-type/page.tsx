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

import EducationTypeTable from './component/EducationTypeTable';

interface EducationTypeProps {}

const EducationType: FunctionComponent<EducationTypeProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Manage Education Type">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-12 px-2">
        <Suspense fallback={<div>Loading...</div>}>
          <EducationTypeTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default EducationType;
