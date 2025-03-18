import { FunctionComponent } from 'react';

import { PayrollRecordApiResponse } from '@/libs/validations/hr-payroll';

import MonthlyPayrollGraph from './Chart/MonthlyPayrollChart';
import PayrollStatistics from './Chart/PayrollStatistics';
import { MonthlyPayrollTrendChart } from './Chart/PayrollTrendChart';

interface PayrollCardProps {
  payrollStats?: PayrollRecordApiResponse;
}

const PayrollCard: FunctionComponent<PayrollCardProps> = ({ payrollStats }) => {
  return (
    <>
      <PayrollStatistics
        totalPaid={payrollStats?.records?.totalPaid}
        totalUnpaid={payrollStats?.records?.totalUnpaid}
        totalPaidAmount={payrollStats?.records?.totalPaidAmount}
        totalPerkAmount={payrollStats?.records?.totalPerkAmount}
        totalUnpaidAmount={payrollStats?.records?.totalAmountTobePaid}
        totalDeduction={payrollStats?.records?.totalSalaryDeduction}
      />
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MonthlyPayrollGraph payrollData={payrollStats?.chartData} />
        </div>
        <div className="lg:col-span-5">
          <MonthlyPayrollTrendChart chartData={payrollStats?.trendData} />
        </div>
      </div>
    </>
  );
};

export default PayrollCard;
