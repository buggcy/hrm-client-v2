import React, { Suspense } from 'react';

import { Bell } from 'lucide-react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Button } from '@/components/ui/button';

import BirthdayChartPage from './components/BirthdayChartPage';
import TabPages from './components/TabPages';

function page() {
  return (
    <Layout>
      <LayoutHeader title="Manage Birthday">
        <LayoutHeaderButtonsBlock>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="size-5" />
          </Button>
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

export default page;
