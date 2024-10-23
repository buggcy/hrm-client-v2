import { FunctionComponent, useEffect } from 'react';

import { useMutation } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';

import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { getAttendanceListStats } from '@/services/hr/attendance-list.service';
import { AuthStoreType } from '@/stores/auth';

import { AttendanceDistribution } from './charts/attendance-distribution';
import { AttendanceHistoryBarChart } from './charts/attendance-history-bar';
import { EmployeeProductivityChart } from './charts/employee-productivity';

interface AttendanceCardsProps {
  dates?: DateRange;
}

const AttendanceCharts: FunctionComponent<AttendanceCardsProps> = ({
  dates,
}) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const { mutate, data: attendanceListStats } = useMutation({
    mutationFn: ({ from, to }: { from?: string; to?: string }) =>
      getAttendanceListStats({
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
        from: dates?.from?.toISOString(),
        to: dates?.to?.toISOString(),
      });
    }
  }, [dates, user, mutate]);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <AttendanceDistribution />
      <AttendanceHistoryBarChart
        data={attendanceListStats?.card2Data}
        date={dates}
      />
      <EmployeeProductivityChart data={attendanceListStats?.card3Data} />
    </div>
  );
};

export default AttendanceCharts;
