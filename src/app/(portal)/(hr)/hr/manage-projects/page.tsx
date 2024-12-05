'use client';
import React, { Suspense } from 'react';

import { Bell } from 'lucide-react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Button } from '@/components/ui/button';

import ProjectTable from './component/ProjectTable';

export default function ManageProjects() {
  return (
    <Layout>
      <LayoutHeader title="Manage Projects">
        <LayoutHeaderButtonsBlock>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="size-5" />
          </Button>
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
