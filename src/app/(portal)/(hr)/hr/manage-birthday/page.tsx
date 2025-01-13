import React, { Suspense } from 'react';

import Header from '@/components/Header/Header';
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
        <Header subheading="Cheers to Our Team: Celebrating Birthdays and Anniversaries All Year Long!"></Header>
        <BirthdayChartPage />
        <Suspense fallback={<div>Loading...</div>}>
          <TabPages />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}

export default ManageBirthday;
