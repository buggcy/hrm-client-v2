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

import AttendanceCards from './components/AttendanceCards';
import AttendanceRequestTable from './components/AttendanceRequestTable.component';
import { RequestAttendanceDialog } from './components/RequestAttendanceDialog.component';

interface EmployeeDashboardProps {}

const AttendanceHistory: FunctionComponent<EmployeeDashboardProps> = () => {
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
      <LayoutWrapper className="flex flex-col gap-12 px-2">
        <Header
          subheading={
            'Ensure your presence is counted—request your attendance now!'
          }
        >
          <div className="flex items-center gap-2">
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
              <span className="hidden sm:block">Request Attendance</span>
            </Button>
          </div>
        </Header>
        <AttendanceCards dates={selectedDate} />
        <Suspense fallback={<div>Loading...</div>}>
          <AttendanceRequestTable dates={selectedDate} />
        </Suspense>
      </LayoutWrapper>
      <RequestAttendanceDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
        type="add"
      />
    </Layout>
  );
};

export default AttendanceHistory;
