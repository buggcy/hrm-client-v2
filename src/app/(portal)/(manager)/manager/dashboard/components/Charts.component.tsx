import React from 'react';

// import { ComplaintsDistribution } from './charts/ComplaintsAndFeedbackDistribution.RadarChart';
import ComplaintsDistribution from './charts/ComplaintsDistribution.RadarChart';
import { Concerns } from './charts/Concerns.RadialChart';
import { DepartmentPieChart } from './charts/DepartmentDistribution.PieChart';
import { EmployeeImpactCard } from './charts/EmployeeImpactCard.mobile';
import { FinanceDistribution } from './charts/FinanceDistribution.AreaChart';
import PerksImpactChart from './charts/PerksImpact.DualAxisChart';
import { PerksOverviewCard } from './charts/PerksOverview.mobile';
import { ProjectDistribution } from './charts/ProjectsDistribution.RadialChart';

const ManagerDashboardCharts = () => {
  const perksData = {
    totalSpent: 300000,
    approvedRequests: 5,
    rejectedRequests: 2,
  };

  const employeeImpactData = {
    performanceScore: 85,
    performanceChange: 5,
    sickLeaves: 3,
    sickLeavesChange: -20,
  };
  return (
    <div className="grid size-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ComplaintsDistribution />
      <Concerns />
      <ProjectDistribution />
      <FinanceDistribution />
      <PerksImpactChart />
      <PerksOverviewCard {...perksData} />
      <EmployeeImpactCard {...employeeImpactData} />
      <DepartmentPieChart />
    </div>
  );
};

export default ManagerDashboardCharts;
