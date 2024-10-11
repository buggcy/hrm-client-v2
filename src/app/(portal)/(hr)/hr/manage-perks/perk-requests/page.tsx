'use client';

import { FunctionComponent } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

interface PerkRequestsProps {}

const PerkRequestsPage: FunctionComponent<PerkRequestsProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Perk Requests">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8 px-2">Hi</LayoutWrapper>
    </Layout>
  );
};

export default PerkRequestsPage;
