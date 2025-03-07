import React from 'react';

import { AttendanceDistribution } from '@/app/(portal)/(hr)/hr/dashboard/components/charts/AttendanceDistribution';
import { EmployeeDistribution } from '@/app/(portal)/(hr)/hr/dashboard/components/charts/EmployeeDistribution';
import { EmployeeProductivity } from '@/app/(portal)/(hr)/hr/dashboard/components/charts/EmployeeProductivity';
import { PerksDistribution } from '@/app/(portal)/(hr)/hr/dashboard/components/charts/PerksDistribution';
import { TopDepartmentChart } from '@/app/(portal)/(hr)/hr/manage-department/component/Chart/TopDepartmentChart';
import { useManagerDashboardStatsQuery } from '@/hooks/hr/useManagerDashboardStats.hook';
import { useDepartmentRecordQuery } from '@/hooks/hr/useProjectDepartment.hook';

import ComplaintsDistribution from './charts/ComplaintsDistribution.RadarChart';
import { ProjectDistribution } from './charts/ProjectsDistribution.RadialChart';

interface HrDashboardmeProps {
  from: string;
  to?: string;
}

const ManagerDashboardCharts = ({ from, to }: HrDashboardmeProps) => {
  const { data } = useManagerDashboardStatsQuery({ from, to });

  const { data: departmentRecord } = useDepartmentRecordQuery();
  return (
    <div className="grid size-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* <FinanceDistribution />
      <Concerns /> */}
      <EmployeeDistribution data={data?.employeeCount} />
      <AttendanceDistribution data={data?.attendanceData} />
      <ProjectDistribution projectStats={data?.projectStatusCounts} />
      <TopDepartmentChart
        chartData={departmentRecord?.topChart}
        type={'dashboard'}
      />
      <EmployeeProductivity data={data?.productivityData} />
      {/* <FinanceDistribution /> */}
      {/* <PerksImpactChart />
      <PerksOverviewCard {...perksData} /> */}
      {/* <EmployeeImpactCard {...employeeImpactData} /> */}
      <PerksDistribution data={data?.perkData} from={from} to={to} />
      <ComplaintsDistribution complaintStats={data?.complaintsData || []} />
    </div>
  );
};

export default ManagerDashboardCharts;
