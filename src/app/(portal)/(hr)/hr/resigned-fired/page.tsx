'use client';
import React, { Suspense } from 'react';
import Link from 'next/link';

import Header from '@/components/Header/Header';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Button } from '@/components/ui/button';

import ResignedFiredEmployeeTable from './component/ResignedFiredTable';

export default function AddEmployeesPage() {
  return (
    <Layout>
      <LayoutHeader title="Resigned / Fired Employees">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Header subheading="Creating a culture where people thrive and businesses grow.">
          <Button asChild>
            <Link href="/hr/resigned-employees" className="flex items-center">
              View Resignations
            </Link>
          </Button>
        </Header>
        <div className="my-6">
          <Suspense fallback={<div>Loading...</div>}>
            <ResignedFiredEmployeeTable />
          </Suspense>
        </div>
      </LayoutWrapper>
    </Layout>
  );
}
