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
  const chartConfig = {
    Net_Salary: {
      label: 'Net Salary',
      color: 'hsl(var(--primary))',
    },
    Tax_Amount: {
      label: 'Tax Amount',
      color: 'hsl(var(--error))',
    },
    Basic_Salary: {
      label: 'Basic Salary',
      color: 'hsl(var(--secondary))',
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
          className="max-h-[272px] min-h-[100px] w-full"
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
            <Bar dataKey="Net_Salary" fill="#30bbf2" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Tax_Amount" fill="#e74c3c" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Basic_Salary" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyPayrollGraph;
