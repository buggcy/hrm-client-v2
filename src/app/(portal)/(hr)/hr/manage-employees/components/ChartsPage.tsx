import React from 'react';

import { EmpAreaChart } from './EmpAreaChart';
import { EmpRedicalChart } from './EmpRedicalChart';

function ChartsPage() {
  return (
    <div>
      <div className="my-6 grid grid-cols-1 gap-5 lg:grid-cols-2"></div>
      <div className="flex justify-between gap-5 max-lg:flex-col">
        <EmpAreaChart />
        <EmpRedicalChart />
      </div>
    </div>
  );
}

export default ChartsPage;
