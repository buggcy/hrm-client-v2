'use client';

import * as React from 'react';

import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { HrStatsPayrollCount } from '@/libs/validations/hr-dashboard';

export const description = 'A donut chart with text';

const chartConfig = {
  count: {
    label: 'Count',
  },
  paid: {
    label: 'Paid',
    color: 'hsl(var(--chart-1))',
  },
  unpaid: {
    label: 'Un-Paid',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

interface PayrollDistributionProps {
  data?: HrStatsPayrollCount;
}

export function PayrollDistribution({ data }: PayrollDistributionProps) {
  const chartData = React.useMemo(
    () => [
      { type: 'paid', count: data?.paid || 0, fill: 'var(--color-paid)' },
      { type: 'unpaid', count: data?.unpaid || 0, fill: 'var(--color-unpaid)' },
    ],
    [data],
  );

  const totalEmployees = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="col-span-1 flex min-h-[250px] flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Payroll Data</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-row items-center justify-between pb-0">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-row items-center gap-1">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
            <p>
              <span className="font-bold">{data?.paid || 0}</span> Paid
            </p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-3))]"></div>
            <p>
              <span className="font-bold">{data?.unpaid || 0}</span> Un-Paid
            </p>
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-full max-w-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              innerRadius={57}
              outerRadius={70}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 4}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalEmployees.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Payrolls
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
