'use client';

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

interface PayrollItem {
  Date: string;
  Net_Salary: number;
}

interface MonthlyPayrollGraphProps {
  payrollData: PayrollItem[];
}

export function MonthlyPayrollGraph({ payrollData }: MonthlyPayrollGraphProps) {
  const allMonths = [
    { month: 'January', Net_Salary: 0 },
    { month: 'February', Net_Salary: 0 },
    { month: 'March', Net_Salary: 0 },
    { month: 'April', Net_Salary: 0 },
    { month: 'May', Net_Salary: 0 },
    { month: 'June', Net_Salary: 0 },
    { month: 'July', Net_Salary: 0 },
    { month: 'August', Net_Salary: 0 },
    { month: 'September', Net_Salary: 0 },
    { month: 'October', Net_Salary: 0 },
    { month: 'November', Net_Salary: 0 },
    { month: 'December', Net_Salary: 0 },
  ];

  const currentMonthIndex = new Date().getMonth();

  const rotatedMonths = [
    ...allMonths.slice(currentMonthIndex + 1),
    ...allMonths.slice(0, currentMonthIndex + 1),
  ];

  const chartConfig = {
    Net_Salary: {
      label: 'Net Salary',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  payrollData.forEach((item: PayrollItem) => {
    const itemMonthIndex = new Date(item.Date).getMonth();
    const rotatedIndex = (itemMonthIndex - (currentMonthIndex + 1) + 12) % 12;
    rotatedMonths[rotatedIndex].Net_Salary += item.Net_Salary || 0;
  });

  return (
    <Card className="h-full">
      <CardHeader className="pr-0">
        <CardTitle className="text-lg">Monthly Payroll</CardTitle>
        <p className="text-sm text-gray-500">Payroll overview for all months</p>
      </CardHeader>
      <CardContent className="w-full pr-0">
        <ChartContainer
          config={chartConfig}
          className="max-h-[275px] min-h-[100px] w-full"
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
            <Bar dataKey="Net_Salary" fill="#30bbf2" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
