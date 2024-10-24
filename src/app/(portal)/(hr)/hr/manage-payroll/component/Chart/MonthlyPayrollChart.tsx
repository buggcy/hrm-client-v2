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
  const chartConfig = {
    Basic_Salary: {
      label: 'Basic Salary',
      color: '#82ca9d',
    },
    Net_Salary: {
      label: 'Net Salary',
      color: 'hsl(var(--primary))',
    },
    Tax_Amount: {
      label: 'Tax Amount',
      color: '#e74c3c',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="pr-0">
        <CardTitle className="text-base font-semibold">
          Monthly Payroll
        </CardTitle>
        <CardDescription className="text-xs">
          Payroll overview for all months
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full pr-0">
        <ChartContainer
          config={chartConfig}
          className="max-h-[256px] min-h-[100px] w-full"
        >
          <BarChart data={payrollData} margin={{ left: 0, right: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickFormatter={value => value.slice(0, 3)}
            />
            <YAxis />
            <Tooltip />
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
