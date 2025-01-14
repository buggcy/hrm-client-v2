'use client';

import { FunctionComponent, Suspense, useState } from 'react';

import { Plus, RefreshCw } from 'lucide-react';

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
import { RefreshAttendanceDialog } from './components/RefreshAttendanceDialog';

interface HrAttendanceListProps {}

const HrAttendanceList: FunctionComponent<HrAttendanceListProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [RefreshDialogOpen, setRefreshDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleRefreshDialogOpen = () => {
    setRefreshDialogOpen(true);
  };

  const handleRefreshDialogClose = () => {
    setRefreshDialogOpen(false);
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
        <Header subheading="Track and Manage Attendance Seamlessly for Every User!">
          <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
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
              <Plus size={16} />
              <span className="hidden sm:block">Add Attendance</span>
            </Button>
            <Button
              className="flex items-center gap-1"
              onClick={handleRefreshDialogOpen}
            >
              <RefreshCw size={16} />
              <span className="hidden lg:block">Refresh Attendance</span>
            </Button>
          </div>
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
      <RefreshAttendanceDialog
        open={RefreshDialogOpen}
        onOpenChange={handleRefreshDialogClose}
        onCloseChange={handleRefreshDialogClose}
      />
    </Layout>
  );
};

export default HrAttendanceList;
