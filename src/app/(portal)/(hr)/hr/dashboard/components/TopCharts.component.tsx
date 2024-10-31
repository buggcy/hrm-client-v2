import React from 'react';

import { EmployeeDistribution } from './charts/EmployeeDistribution';
import { PayrollDistribution } from './charts/PayrollDistribution';
import { RequestDistribution } from './charts/RequestDistribution';

const TopCharts = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
      <EmployeeDistribution />
      <RequestDistribution />
      <PayrollDistribution />
    </div>
  );
};

export default TopCharts;
