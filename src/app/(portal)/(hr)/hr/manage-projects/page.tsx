'use client';
import React, { Suspense } from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import ProjectTable from './component/ProjectTable';

export default function ManageProjects() {
  return (
    <Layout>
      <LayoutHeader title="Manage Projects">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
