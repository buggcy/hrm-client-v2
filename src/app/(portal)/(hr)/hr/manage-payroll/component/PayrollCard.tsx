import { FunctionComponent } from 'react';

import Header from '@/components/Header/Header';
import {
  DateMonthPicker,
  useMonthPicker,
} from '@/components/MonthPicker/DateMonthPicker';

import { usePayrollStatisticsQuery } from '@/hooks/hr/useHrPayroll.hook';

import MonthlyPayrollGraph from './Chart/MonthlyPayrollChart';
import PayrollStatistics from './Chart/PayrollStatistics';
import { MonthlyPayrollTrendChart } from './Chart/PayrollTrendChart';

interface PayrollCardProps {}

const PayrollCard: FunctionComponent<PayrollCardProps> = () => {
  const { timeRange, selectedMonth, setTimeRange, handleSetMonth } =
    useMonthPicker();
  const defaultDate = new Date();
  const month = selectedMonth
    ? selectedMonth.getMonth() + 1
    : defaultDate.getMonth() + 1;
  const year = selectedMonth
    ? selectedMonth.getFullYear().toString()
    : defaultDate.getFullYear().toString();

  const formattedMonth = month < 10 ? `0${month}` : `${month}`;

  const { data: payrollStats } = usePayrollStatisticsQuery({
    month: formattedMonth,
    year: year,
  });

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
      <PayrollStatistics
        totalPaid={payrollStats?.records?.totalPaid}
        totalUnpaid={payrollStats?.records?.totalUnpaid}
        totalPaidAmount={payrollStats?.records?.totalPaidAmount}
        totalPerkAmount={payrollStats?.records?.totalIncrementAmount}
        totalUnpaidAmount={payrollStats?.records?.totalAmountTobePaid}
        totalDeduction={payrollStats?.records?.totalSalaryDeduction}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
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
