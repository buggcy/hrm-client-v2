'use client';

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

interface RadialChartProps {
  netSalary: number;
  totalDeductions: number;
}

export function RadialChart({ netSalary, totalDeductions }: RadialChartProps) {
  const chartData = [
    {
      name: 'Net Salary',
      value: netSalary,
      fill: '#22c55e',
    },
    {
      name: 'Total Deductions',
      value: totalDeductions,
      fill: '#ef4444',
    },
  ];

  const chartConfig = {
    salary: {
      label: 'Salary Distribution',
    },
    netSalary: {
      label: 'Net Salary',
      color: 'hsl(var(--chart-1))',
    },
    deductions: {
      label: 'Total Deductions',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Salary Distribution</CardTitle>
        <CardDescription>Net Salary vs Total Deductions</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={360}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].value.toLocaleString()}
                          <tspan className="text-xs">Rs.</tspan>
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Net Salary
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Deductions: {totalDeductions.toLocaleString()}{' '}
          <tspan className="text-xs">Rs.</tspan>
        </div>
        <div className="leading-none text-muted-foreground">
          Showing breakdown of salary for this month
        </div>
      </CardFooter>
    </Card>
  );
}
