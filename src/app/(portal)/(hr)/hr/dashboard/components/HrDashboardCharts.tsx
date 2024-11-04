'use client';

import React from 'react';

import { useHrDashboardStatsQuery } from '@/hooks/hr/useDasdhboard.hook';

import { AttendanceDistribution } from './charts/AttendanceDistribution';
import { DepartmentDistribution } from './charts/DepartmentDistribution';
import { EmployeeDistribution } from './charts/EmployeeDistribution';
import { EmployeeProductivity } from './charts/EmployeeProductivity';
import { PayrollDistribution } from './charts/PayrollDistribution';
import { PerksDistribution } from './charts/PerksDistribution';
import { ProjectProgress } from './charts/ProjectProgress';
import { RequestDistribution } from './charts/RequestDistribution';

const HrDashboardCharts = () => {
  const { data } = useHrDashboardStatsQuery();
  console.log(data);
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
        <DepartmentDistribution />
        <ProjectProgress />
        <EmployeeProductivity data={data?.productivityData} />
      </div>
    </div>
  );
};

export default HrDashboardCharts;
