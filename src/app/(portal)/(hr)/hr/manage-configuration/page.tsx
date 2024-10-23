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

import ConfigurationTypeTable from './component/ConfigurationTypeTables';

interface ManageConfigurationProps {}

const ManageConfiguration: FunctionComponent<ManageConfigurationProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Manage Configuration">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-12 px-2">
        <Suspense fallback={<div>Loading...</div>}>
          <ConfigurationTypeTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default ManageConfiguration;
