import { FunctionComponent } from 'react';

import Header from '@/components/Header/Header';
import {
  DateMonthPicker,
  useMonthPicker,
} from '@/components/MonthPicker/DateMonthPicker';

import { MonthlyPayrollGraph } from './Chart/MonthlyPayrollChart';
import { PayrollStatistics } from './Chart/PayrollStatistics';
import { PayrollTrendChart } from './Chart/PayrollTrendChart';

interface PayrollCardProps {}

const PayrollCard: FunctionComponent<PayrollCardProps> = () => {
  const { timeRange, selectedMonth, setTimeRange, handleSetMonth } =
    useMonthPicker();

  return (
    <>
      <Header subheading="Ensuring your payroll is right on time!">
        <DateMonthPicker
          timeRange={timeRange}
          selectedMonth={selectedMonth}
          setTimeRange={setTimeRange}
          setMonth={handleSetMonth}
        />
      </Header>
      <PayrollStatistics />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MonthlyPayrollGraph />
        </div>
        <div className="lg:col-span-5">
          <PayrollTrendChart />
        </div>
      </div>
    </>
  );
};

export default PayrollCard;
