import React from 'react';

import { AttendanceDistribution } from './charts/AttendanceDistribution';
import { PerksDistribution } from './charts/PerksDistribution';

const MiddleCharts = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-x-0 gap-y-4 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
      <PerksDistribution />
      <AttendanceDistribution />
    </div>
  );
};

export default MiddleCharts;
