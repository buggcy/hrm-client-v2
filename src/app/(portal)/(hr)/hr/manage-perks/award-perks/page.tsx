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

interface AwardPerksProps {}

const AwardPerksPage: FunctionComponent<AwardPerksProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Award Perks">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8 px-2">Hi</LayoutWrapper>
    </Layout>
  );
};

export default AwardPerksPage;
