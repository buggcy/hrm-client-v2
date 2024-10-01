'use client';
import { FunctionComponent, useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { MonthPickerComponent } from '@/components/MonthPicker';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { getLeaveHistoryStats } from '@/services/employee/leave-history.service';
import { AuthStoreType } from '@/stores/auth';

import LeaveCards from './components/LeaveCards';
import LeaveHistoryTable from './components/LeaveHistoryTable.component';

interface LeaveHistoryProps {}

const LeaveHistory: FunctionComponent<LeaveHistoryProps> = () => {
  const [date, setDate] = useState(new Date());
  const initialDate = new Date();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const {
    mutate,
    isPending,
    data: leaveHistoryStats,
  } = useMutation({
    mutationFn: ({ id, year }: { id: string; year: number }) =>
      getLeaveHistoryStats({
        id,
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
        id: user?.id ? user.id : '',
        year: date.getFullYear(),
      });
    }
  }, [date, user, mutate]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Leave">
        <LayoutHeaderButtonsBlock>
          <MonthPickerComponent setDate={setDate} initialDate={initialDate} />
          <ReadDocsButton to="home" />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-0">
            <CardTitle>Good Afternoon, Sourav!</CardTitle>
            <Button>Apply Leave Form</Button>
          </CardHeader>
          <CardContent>
            <CardDescription>
              You have 2 leave requests pending.
            </CardDescription>
          </CardContent>
        </Card>
        <LeaveCards data={leaveHistoryStats} />
        <LeaveHistoryTable date={date} />
      </LayoutWrapper>
    </Layout>
  );
};

export default LeaveHistory;
