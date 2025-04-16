'use client';

import { FunctionComponent, Suspense } from 'react';
import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Button } from '@/components/ui/button';

import OvertimeApproval from './component/OvertimeApproval';
import OvertimeHRTable from './component/OvertimeTable';

interface HrLeaveRequestsProps {}

const OvertimeRequestPage: FunctionComponent<HrLeaveRequestsProps> = () => {
  const router = useRouter();
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader
        title="Overtime Requests"
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
      <LayoutWrapper wrapperClassName="flex flex-1" className="max-w-full">
        <Header subheading="Review and Approve Employee Overtime Requests">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
        </Header>
        <Suspense fallback={<div>Loading...</div>}>
          <OvertimeApproval selectedDate={selectedDate} />
        </Suspense>
      </LayoutWrapper>
      <LayoutWrapper wrapperClassName="flex flex-1 mt-5">
        <Suspense fallback={<div>Loading...</div>}>
          <OvertimeHRTable selectedDate={selectedDate} />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default OvertimeRequestPage;
