'use client';

import { FunctionComponent, Suspense, useState } from 'react';

import { Plus } from 'lucide-react';

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

import AttendanceCharts from './components/AttendanceCharts';
import { AttendanceDialog } from './components/AttendanceDialog';
import AttendanceListTable from './components/AttendanceListTable.component';

interface HrAttendanceListProps {}

const HrAttendanceList: FunctionComponent<HrAttendanceListProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Attendance">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8 px-2">
        <Header subheading="You are 15 minutes late today!">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
          <Button
            className="flex items-center gap-1"
            onClick={handleDialogOpen}
          >
            <Plus size={16} /> Add Attendance
          </Button>
        </Header>
        <AttendanceCharts dates={selectedDate} />
        <Suspense fallback={<div>Loading...</div>}>
          <AttendanceListTable dates={selectedDate} />
        </Suspense>
      </LayoutWrapper>
      <AttendanceDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
        type={'add'}
      />
    </Layout>
  );
};

export default HrAttendanceList;
