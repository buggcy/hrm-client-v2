import { FunctionComponent } from 'react';

import { DateRange } from 'react-day-picker';

import { useAttendanceRequestStats } from '@/hooks/employee/useEmployeeAttendanceRequest.hook';
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
  const { data } = useAttendanceRequestStats({
    from: formatedDate(dates?.from),
    to: formatedDate(dates?.to),
  });
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <RecentAttendanceRequests data={data?.recentRequests} />
      <AttendanceRequestsMonthSummary data={data?.monthsummary} />
      <AttendanceRequestChart data={data?.summary} />
    </section>
  );
};

export default AttendanceCards;
