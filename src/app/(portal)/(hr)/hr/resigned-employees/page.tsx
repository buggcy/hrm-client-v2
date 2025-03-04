'use client';
import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Button } from '@/components/ui/button';

import ResignedApproval from './components/ResignedApproval';
import ResignedListTable from './components/ResignedTable';

export default function ResignedEmployeesPage() {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const router = useRouter();

  return (
    <Layout>
      <LayoutHeader
        title="Resigned Requests"
        leftElement={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go Back"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full p-1"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-5" />
          </Button>
        }
      >
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1" className="mb-5">
        <Header subheading="Easily Track and Approve Employee Resignation Requests!">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
        </Header>
        <Suspense fallback={<div>Loading...</div>}>
          <ResignedApproval selectedDate={selectedDate} />
        </Suspense>
      </LayoutWrapper>
      <LayoutWrapper wrapperClassName="flex flex-1 mt-5">
        <Suspense fallback={<div>Loading...</div>}>
          <ResignedListTable selectedDate={selectedDate} />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
