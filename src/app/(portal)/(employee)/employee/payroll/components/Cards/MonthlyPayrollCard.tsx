'use client';

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

interface MonthlyPayrollGraphProps {
  payrollChart: { month: string; Net_Salary: number }[];
}
export function MonthlyPayrollGraph({
  payrollChart,
}: MonthlyPayrollGraphProps) {
  const chartConfig = {
    Net_Salary: {
      label: 'Net Salary',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-full">
      <CardHeader className="pr-0">
        <CardTitle className="text-lg">Monthly Payroll</CardTitle>
        <p className="text-sm text-gray-500">
          Payroll overview for current year
        </p>
      </CardHeader>
      <CardContent className="w-full pr-0">
        <ChartContainer
          config={chartConfig}
          className="max-h-[275px] min-h-[100px] w-full"
        >
          <BarChart data={payrollChart} margin={{ left: 0, right: 20 }}>
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
