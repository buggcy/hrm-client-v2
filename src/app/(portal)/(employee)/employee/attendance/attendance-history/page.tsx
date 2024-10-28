'use client';

import { FunctionComponent, Suspense, useEffect } from 'react';

import { useMutation } from '@tanstack/react-query';

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
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { getAttendanceHistoryStats } from '@/services/employee/attendance-history.service';
import { AuthStoreType } from '@/stores/auth';

import AttendanceCards from './components/AttendanceCards';
import AttendanceHistoryTable from './components/AttendanceHistoryTable.component';

interface EmployeeDashboardProps {}

const AttendanceHistory: FunctionComponent<EmployeeDashboardProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const {
    mutate,
    isPending,
    data: attendanceHistoryStats,
  } = useMutation({
    mutationFn: ({
      id,
      from,
      to,
    }: {
      id: string;
      from?: string;
      to?: string;
    }) =>
      getAttendanceHistoryStats({
        id,
        from,
        to,
      }),
    onError: err => {
      toast({
        title: 'Error',
        description: err?.message || 'Error on fetching stats data!',
        variant: 'error',
      });
    },
  });

  useEffect(() => {
    if (user) {
      mutate({
        id: user?.Tahometer_ID ? user.Tahometer_ID : '',
        from: selectedDate?.from?.toISOString(),
        to: selectedDate?.to?.toISOString(),
      });
    }
  }, [selectedDate, user, mutate]);

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Attendance">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-12 px-2">
        <Header subheading="You are 15 minutes late today!">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
        </Header>
        <AttendanceCards data={attendanceHistoryStats} isPending={isPending} />
        <Suspense fallback={<div>Loading...</div>}>
          <AttendanceHistoryTable dates={selectedDate} />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default AttendanceHistory;
