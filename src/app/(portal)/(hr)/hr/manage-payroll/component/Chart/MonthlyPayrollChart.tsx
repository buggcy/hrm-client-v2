'use client';

import { FunctionComponent } from 'react';

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

import { PayrollMonthlyChart } from '@/types/hr-payroll.types';
interface ChartDataProps {
  payrollData?: PayrollMonthlyChart[];
}

const MonthlyPayrollGraph: FunctionComponent<ChartDataProps> = ({
  payrollData,
}) => {
  const renderLegend = () => (
    <div className="flex justify-center">
      {Object.entries(chartConfig).map(([key, { label, color }]) => (
        <div key={key} className="mr-4 flex items-center">
          <div
            className="mr-1 size-2"
            style={{
              backgroundColor: color,
              borderRadius: '2px',
            }}
          />
          <span className="text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
  const allMonths = [
    { month: 'January', Basic_Salary: 0, Net_Salary: 0, Tax_Amount: 0 },
    { month: 'February', Basic_Salary: 0, Net_Salary: 0, Tax_Amount: 0 },
    { month: 'March', Basic_Salary: 0, Net_Salary: 0, Tax_Amount: 0 },
    { month: 'April', Basic_Salary: 0, Net_Salary: 0, Tax_Amount: 0 },
    { month: 'May', Basic_Salary: 0, Net_Salary: 0, Tax_Amount: 0 },
    { month: 'June', Basic_Salary: 0, Net_Salary: 0, Tax_Amount: 0 },
    { month: 'July', Basic_Salary: 0, Net_Salary: 0, Tax_Amount: 0 },
    { month: 'August', Basic_Salary: 0, Net_Salary: 0, Tax_Amount: 0 },
    { month: 'September', Basic_Salary: 0, Net_Salary: 0, Tax_Amount: 0 },
    { month: 'October', Basic_Salary: 0, Net_Salary: 0, Tax_Amount: 0 },
    { month: 'November', Basic_Salary: 0, Net_Salary: 0, Tax_Amount: 0 },
    { month: 'December', Basic_Salary: 0, Net_Salary: 0, Tax_Amount: 0 },
  ];
  const chartConfig = {
    Basic_Salary: {
      label: 'Basic Salary',
      color: 'hsl(var(--chart-1))',
    },
    Net_Salary: {
      label: 'Net Salary',
      color: 'hsl(var(--primary))',
    },
    Tax_Amount: {
      label: 'Tax Amount',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;
  const currentMonthIndex = new Date().getMonth();

  const rotatedMonths = [
    ...allMonths.slice(currentMonthIndex + 1),
    ...allMonths.slice(0, currentMonthIndex + 1),
  ];

  const monthIndexMap: { [key: string]: number } = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  if (payrollData && Array.isArray(payrollData)) {
    payrollData.forEach((item: PayrollMonthlyChart) => {
      if (!item?.month) return;

      const itemMonthIndex = monthIndexMap[item.month];
      if (itemMonthIndex === undefined) return;

      const rotatedIndex = (itemMonthIndex - (currentMonthIndex + 1) + 12) % 12;

      if (rotatedMonths[rotatedIndex]) {
        rotatedMonths[rotatedIndex].Basic_Salary += item.Basic_Salary || 0;
        rotatedMonths[rotatedIndex].Net_Salary += item.Net_Salary || 0;
        rotatedMonths[rotatedIndex].Tax_Amount += item.Tax_Amount || 0;
      }
    });
  }

  return (
    <Card>
      <CardHeader className="pr-0">
        <CardTitle className="font-semibold">Monthly Payroll</CardTitle>
        <CardDescription className="text-sm">
          Payroll overview for all months
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full pr-0">
        <ChartContainer
          config={chartConfig}
          className="max-h-[256px] min-h-[100px] w-full"
        >
          <BarChart data={rotatedMonths} margin={{ left: 0, right: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickFormatter={value => value.slice(0, 3)}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat('en-IN').format(value)
              }
            />
            <Bar dataKey="Basic_Salary" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Net_Salary" fill="#30bbf2" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Tax_Amount" fill="#e74c3c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
        {renderLegend()}
      </CardContent>
    </Card>
  );
};

export default MonthlyPayrollGraph;
