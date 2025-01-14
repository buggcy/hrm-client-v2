'use client';

import React from 'react';

import { useHrDashboardStatsQuery } from '@/hooks/hr/useDasdhboard.hook';
import { useDepartmentRecordQuery } from '@/hooks/hr/useProjectDepartment.hook';

import { AttendanceDistribution } from './charts/AttendanceDistribution';
import { EmployeeDistribution } from './charts/EmployeeDistribution';
import { EmployeeProductivity } from './charts/EmployeeProductivity';
import { PayrollDistribution } from './charts/PayrollDistribution';
import { PerksDistribution } from './charts/PerksDistribution';
import { ProjectProgress } from './charts/ProjectProgress';
import { RequestDistribution } from './charts/RequestDistribution';
import { TopDepartmentChart } from '../../manage-department/component/Chart/TopDepartmentChart';
interface HrDashboardmeProps {
  month: string;
  year: string;
}
const HrDashboardCharts = ({ month, year }: HrDashboardmeProps) => {
  const isEnabled = !!month && !!year;
  const { data } = useHrDashboardStatsQuery(
    { month, year },
    {
      enabled: isEnabled,
    },
  );
  const { data: departmentRecord } = useDepartmentRecordQuery();
  return (
    <div className="flex size-full flex-col gap-4">
      <div className="grid w-full grid-cols-1 gap-x-0 gap-y-4 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
        <EmployeeDistribution data={data?.employeeCount} />
        <RequestDistribution data={data?.pendingRequests} />
        <PayrollDistribution data={data?.payrollCount} />
      </div>
      <div className="grid w-full grid-cols-1 gap-x-0 gap-y-4 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
        <PerksDistribution data={data?.perkData} />
        <AttendanceDistribution data={data?.attendanceData} />
      </div>
      <div className="grid w-full grid-cols-1 gap-x-0 gap-y-4 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
        <TopDepartmentChart
          chartData={departmentRecord?.topChart}
          type={'dashboard'}
        />
        <ProjectProgress />
        <EmployeeProductivity data={data?.productivityData} />
      </div>
    </div>
  );
};

export default HrDashboardCharts;
