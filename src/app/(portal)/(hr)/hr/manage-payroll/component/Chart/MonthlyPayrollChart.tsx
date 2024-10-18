'use client';

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

const payrollData = [
  { month: 'January', Net_Salary: 500, Tax_Amount: 50, Basic_Salary: 100 },
  { month: 'February', Net_Salary: 400, Tax_Amount: 40, Basic_Salary: 100 },
  { month: 'March', Net_Salary: 550, Tax_Amount: 55, Basic_Salary: 100 },
  { month: 'April', Net_Salary: 480, Tax_Amount: 48, Basic_Salary: 100 },
  { month: 'May', Net_Salary: 600, Tax_Amount: 60, Basic_Salary: 100 },
  { month: 'June', Net_Salary: 420, Tax_Amount: 42, Basic_Salary: 100 },
  { month: 'July', Net_Salary: 650, Tax_Amount: 65, Basic_Salary: 100 },
  { month: 'August', Net_Salary: 470, Tax_Amount: 47, Basic_Salary: 100 },
  { month: 'September', Net_Salary: 530, Tax_Amount: 53, Basic_Salary: 100 },
  { month: 'October', Net_Salary: 580, Tax_Amount: 58, Basic_Salary: 100 },
  { month: 'November', Net_Salary: 600, Tax_Amount: 60, Basic_Salary: 100 },
  { month: 'December', Net_Salary: 700, Tax_Amount: 70, Basic_Salary: 100 },
];

export function MonthlyPayrollGraph() {
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
}
