'use client';

import { FunctionComponent, Suspense, useState } from 'react';

import { Plus } from 'lucide-react';
import moment from 'moment';

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
import { useStores } from '@/providers/Store.Provider';

import { useTodayAttendence } from '@/hooks/attendanceHistory/useAttendanceHistoryList.hook';
import { AuthStoreType } from '@/stores/auth';

import AttendanceCards from './components/AttendanceCards';
import AttendanceRequestTable from './components/AttendanceRequestTable.component';
import { RequestAttendanceDialog } from './components/RequestAttendanceDialog.component';

interface EmployeeDashboardProps {}

const AttendanceHistory: FunctionComponent<EmployeeDashboardProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const todayDate = moment().format('YYYY-MM-DD');

  const { data } = useTodayAttendence(
    user?.Tahometer_ID || '',
    user?.Tahometer_ID ? todayDate : '',
  );

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
            data?.data?.Status
              ? data?.data?.Status === 'Absent'
                ? 'You are Absent Today!'
                : data?.data?.Status === 'Leave'
                  ? 'You are on leave today.'
                  : data?.data?.Status === 'Holiday'
                    ? 'Today is marked as a holiday and an off day.'
                    : data?.data?.Status === 'Present' &&
                        data?.data?.Late_Minutes === 0
                      ? "You're marked as present today! Great job, you're on time!"
                      : `You are ${data?.data?.Late_Minutes} minutes late today!`
              : "Your today's attendance not recorded yet."
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
