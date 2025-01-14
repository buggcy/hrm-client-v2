'use client';

import { FunctionComponent, Suspense, useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
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
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useTodayAttendence } from '@/hooks/attendanceHistory/useAttendanceHistoryList.hook';
import { getAttendanceHistoryStats } from '@/services/employee/attendance-history.service';
import { AuthStoreType } from '@/stores/auth';
import { AttendanceHistoryStoreType } from '@/stores/employee/attendance-history';
import { formatedDate } from '@/utils';

import AttendanceCards from './components/AttendanceCards';
import AttendanceHistoryTable from './components/AttendanceHistoryTable.component';
import { RefreshAttendanceDialog } from './components/RefreshAttendanceDialog';

interface EmployeeDashboardProps {}

const AttendanceHistory: FunctionComponent<EmployeeDashboardProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const { attendanceHistoryStore } = useStores() as {
    attendanceHistoryStore: AttendanceHistoryStoreType;
  };
  const { setRefetchAttendanceHistoryList, refetchAttendanceHistoryList } =
    attendanceHistoryStore;
  const todayDate = moment().format('YYYY-MM-DD');

  const { data } = useTodayAttendence(
    user?.Tahometer_ID || '',
    user?.Tahometer_ID ? todayDate : '',
  );

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
        from: formatedDate(selectedDate?.from),
        to: formatedDate(selectedDate?.to),
      });
    }
  }, [selectedDate, user, mutate]);

  useEffect(() => {
    if (refetchAttendanceHistoryList) {
      mutate({
        id: user?.Tahometer_ID ? user.Tahometer_ID : '',
        from: selectedDate?.from?.toISOString(),
        to: selectedDate?.to?.toISOString(),
      });
      setRefetchAttendanceHistoryList(false);
    }
  }, [
    refetchAttendanceHistoryList,
    selectedDate,
    user,
    mutate,
    setRefetchAttendanceHistoryList,
  ]);

  const [RefreshDialogOpen, setRefreshDialogOpen] = useState(false);

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
              onClick={handleRefreshDialogOpen}
            >
              <RefreshCw size={16} />
              <span className="hidden lg:block">Refresh Attendance</span>
            </Button>
          </div>
        </Header>
        <AttendanceCards data={attendanceHistoryStats} isPending={isPending} />
        <Suspense fallback={<div>Loading...</div>}>
          <AttendanceHistoryTable dates={selectedDate} />
        </Suspense>
      </LayoutWrapper>
      <RefreshAttendanceDialog
        open={RefreshDialogOpen}
        onOpenChange={handleRefreshDialogClose}
        onCloseChange={handleRefreshDialogClose}
      />
    </Layout>
  );
};

export default AttendanceHistory;
