'use client';

import { FunctionComponent, Suspense, useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { MonthPickerComponent } from '@/components/MonthPicker';
import { Notification } from '@/components/NotificationIcon';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { getAttendanceHistoryStats } from '@/services/employee/attendance-history.service';
import { AuthStoreType } from '@/stores/auth';

import AttendanceCards from './components/AttendanceCards';
import AttendanceHistoryTable from './components/AttendanceHistoryTable.component';

interface EmployeeDashboardProps {}

const AttendanceHistory: FunctionComponent<EmployeeDashboardProps> = () => {
  const [date, setDate] = useState(new Date());
  const initialDate = new Date();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const {
    mutate,
    isPending,
    data: attendanceHistoryStats,
  } = useMutation({
    mutationFn: ({
      id,
      month,
      year,
    }: {
      id: string;
      month: number;
      year: number;
    }) =>
      getAttendanceHistoryStats({
        id,
        month,
        year,
      }),
    onError: err => {
      toast({
        title: 'Error',
        description: err?.message || 'Error on fetching stats data!',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (user) {
      mutate({
        id: user?.Tahometer_ID ? user.Tahometer_ID : '',
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });
    }
  }, [date, user, mutate]);

  const setDateValue = (date: Date | null) => {
    setDate(date || new Date());
  };

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Attendance">
        <LayoutHeaderButtonsBlock>
          <MonthPickerComponent
            setDateValue={setDateValue}
            initialDate={initialDate}
          />
          <Notification />

        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-12 px-2">
        <Header subheading="You are 15 minutes late today!">
          <MonthPickerComponent
            setDateValue={setDateValue}
            initialDate={initialDate}
          />
        </Header>
        <AttendanceCards data={attendanceHistoryStats} isPending={isPending} />
        <Suspense fallback={<div>Loading...</div>}>
          <AttendanceHistoryTable date={date} />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default AttendanceHistory;
