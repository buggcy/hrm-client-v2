import React from 'react';

import { DepartmentDistribution } from './charts/DepartmentDistribution';
import { EmployeeProductivity } from './charts/EmployeeProductivity';
import { ProjectProgress } from './charts/ProjectProgress';

const BottomCharts = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-x-0 gap-y-4 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
      <DepartmentDistribution />
      <ProjectProgress />
      <EmployeeProductivity />
    </div>
  );
};

export default BottomCharts;
