'use client';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

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

import { useHrDashboardStatsQuery } from '@/hooks/hr/useDasdhboard.hook';
import { useDepartmentRecordQuery } from '@/hooks/hr/useProjectDepartment.hook';

import HrDashboardCharts from './components/HrDashboardCharts';

interface HrDashboardmeProps {}

const HrDashboardme: FunctionComponent<HrDashboardmeProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const from = moment(selectedDate?.from).format('YYYY-MM-DD');
  const to = moment(selectedDate?.to).format('YYYY-MM-DD');
  const isEnabled = !!from;
  const { data } = useHrDashboardStatsQuery(
    { from, to },
    {
      enabled: isEnabled,
    },
  );
  const { data: departmentRecord } = useDepartmentRecordQuery();

  const subheadings = useMemo(() => {
    const defaultMessage =
      'Gathering workforce insights... Stay tuned for real-time HR updates!';

    if (!data) {
      return [defaultMessage];
    }

    return [
      `Managing a team of    ${
        ((data?.employeeCount?.fullTime && data?.employeeCount?.intern) || 0) >
        0
          ? `${Number(data?.employeeCount?.fullTime || 0) + Number(data?.employeeCount?.intern || 0)} employees—keep track of attendance, payroll, and productivity effortlessly!`
          : ''
      }`,
      `
   ${
     (data?.payrollCount?.unpaid || 0) > 0
       ? `${Number(data?.payrollCount?.unpaid || 0)} pending payrolls & ${Object.values(
           data?.pendingRequests || {},
         ).reduce(
           (a, b) => Number(a) + Number(b),
           0,
         )} pending requests—streamline your HR tasks today!`
       : ''
   }`,
      `Your workforce at a glance: ${Number(data?.employeeCount?.fullTime || 0)} full-time, ${Number(data?.employeeCount?.intern || 0)} interns—optimize attendance & performance!`,
      `Stay ahead—${Number(data?.pendingRequests?.attandence || 0)} attendance, ${Number(data?.pendingRequests?.overtime || 0)} overtime, and ${Number(data?.pendingRequests?.leave || 0)} leave requests awaiting action!`,
      `Boost productivity! Employees are active, but this week's productivity is ${Object.values(
        data?.productivityData || {},
      ).reduce((a, b) => Number(a) + Number(b), 0)}%—let's improve!`,
    ];
  }, [data]);

  const [currentSubheading, setCurrentSubheading] = useState(subheadings[0]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubheading(prev => {
        const nextIndex = (subheadings.indexOf(prev) + 1) % subheadings.length;
        return subheadings[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [subheadings]);
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Dashboard">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8">
        <Header subheading={currentSubheading}>
          <div className="flex flex-wrap">
            <DateRangePicker
              timeRange={timeRange}
              selectedDate={selectedDate}
              setTimeRange={setTimeRange}
              setDate={handleSetDate}
            />
          </div>
        </Header>
        <HrDashboardCharts
          from={from}
          to={to}
          data={data}
          departmentRecord={departmentRecord}
        />
      </LayoutWrapper>
    </Layout>
  );
};

export default HrDashboardme;
