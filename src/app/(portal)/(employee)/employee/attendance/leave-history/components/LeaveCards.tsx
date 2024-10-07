import React, { FunctionComponent, useEffect } from 'react';

import { useMutation } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';

import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { getLeaveHistoryStats } from '@/services/employee/leave-history.service';
import { AuthStoreType } from '@/stores/auth';

import ConsumedLeaves from './charts/ConsumedLeaves';
import LeavePattern from './charts/LeavePattern';
import MonthlyStats from './charts/MonthlyStats';

interface LeaveCardsProps {
  date?: DateRange;
}

const LeaveCards: FunctionComponent<LeaveCardsProps> = ({ date }) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const { mutate, data } = useMutation({
    mutationFn: ({ id, from, to }: { id: string; from: string; to: string }) =>
      getLeaveHistoryStats({
        id,
        from,
        to,
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
        from: date?.from?.toISOString() || '',
        to: date?.to?.toISOString() || '',
      });
    }
  }, [date, user, mutate]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <LeavePattern data={data?.dayOfWeekCount} />
      <MonthlyStats data={data?.monthCount} />
      <ConsumedLeaves data={data?.leaves} />
    </div>
  );
};

export default LeaveCards;
