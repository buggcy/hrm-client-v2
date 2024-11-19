import React from 'react';

import { EmployeeChart } from '@/services/hr/employee.service';

import { EmpAreaChart } from './EmpAreaChart';
import { EmpRedicalChart } from './EmpRedicalChart';
interface ChartProps {
  hrDashboardStats?: {
    intern: number;
    probational: number;
    fullTime: number;
  };
  hrEmployeeApprovalStats?: EmployeeChart[];
}
function ChartsPage({ hrEmployeeApprovalStats, hrDashboardStats }: ChartProps) {
  return (
    <div>
      <div className="my-6 grid grid-cols-1 gap-5 lg:grid-cols-2"></div>
      <div className="flex justify-between gap-5 max-lg:flex-col">
        <EmpAreaChart chartData={hrEmployeeApprovalStats || []} />
        <EmpRedicalChart data={hrDashboardStats} />
      </div>
    </div>
  );
}

export default ChartsPage;
