import React, { Suspense } from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import BirthdayChartPage from './components/BirthdayChartPage';
import TabPages from './components/TabPages';

function ManageBirthday() {
  return (
    <Layout>
      <LayoutHeader title="Manage Birthday">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1" className="space-y-5">
        <BirthdayChartPage />
        <Suspense fallback={<div>Loading...</div>}>
          <TabPages />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}

export default ManageBirthday;
