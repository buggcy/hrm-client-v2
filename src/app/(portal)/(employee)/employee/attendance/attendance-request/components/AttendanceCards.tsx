import { FunctionComponent, useEffect } from 'react';

import { DateRange } from 'react-day-picker';

import { useStores } from '@/providers/Store.Provider';

import { useAttendanceRequestStats } from '@/hooks/employee/useEmployeeAttendanceRequest.hook';
import { AuthStoreType } from '@/stores/auth';
import { AttendanceRequestStoreType } from '@/stores/employee/attendance-request';
import { formatedDate } from '@/utils';

import { AttendanceRequestChart } from './Charts/AttendanceRequestChart';
import { AttendanceRequestsMonthSummary } from './Charts/AttendanceRequestsMonthSummary';
import { RecentAttendanceRequests } from './Charts/RecentAttendanceRequests';

interface AttendanceCardsProps {
  dates?: DateRange;
}

const AttendanceCards: FunctionComponent<AttendanceCardsProps> = ({
  dates,
}) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const { data, refetch } = useAttendanceRequestStats({
    from: formatedDate(dates?.from),
    to: formatedDate(dates?.to),
    userId: user?.id,
  });
  const { attendanceRequestStore } = useStores() as {
    attendanceRequestStore: AttendanceRequestStoreType;
  };
  const { refetchAttendanceRequestList, setRefetchAttendanceRequestList } =
    attendanceRequestStore;
  useEffect(() => {
    if (refetchAttendanceRequestList) {
      void (async () => {
        await refetch();
      })();

      setRefetchAttendanceRequestList(false);
    }
  }, [refetchAttendanceRequestList, setRefetchAttendanceRequestList, refetch]);
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <RecentAttendanceRequests data={data?.recentRequests} />
      <AttendanceRequestsMonthSummary data={data?.monthsummary} />
      <AttendanceRequestChart data={data?.summary} />
    </section>
  );
};

export default AttendanceCards;
