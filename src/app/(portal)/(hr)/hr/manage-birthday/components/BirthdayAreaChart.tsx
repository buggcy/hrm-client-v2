'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { useEmployeeDobChartQuery } from '@/hooks/EmployeeDobTable/useEmpDob.hook';

export const description = 'An area chart with a legend';

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  DOB: Date;
  Joining_Date?: Date | null;
  remainingDays: number;
}

const chartConfig = {
  recentDOB: {
    label: 'Recent DOB Count ',
    color: 'hsl(var(--chart-1))',
  },
  recentAnniversary: {
    label: 'Recent Anniversary Count ',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function BirthdayAreaChart() {
  const { data: myData } = useEmployeeDobChartQuery();

  // Prepare chart data
  const chartData = Array.from({ length: 12 }, (_, index) => {
    const month = new Date(0, index).toLocaleString('default', {
      month: 'long',
    });
    const dobThisMonth = myData?.filter(
      (employee: Employee) => new Date(employee?.DOB).getMonth() === index,
    );
    const anniversaryThisMonth = myData?.filter(
      (employee: Employee) =>
        new Date(employee?.Joining_Date || '').getMonth() === index,
    );

    return {
      month,
      recentDOB: dobThisMonth?.length ?? 0,
      recentAnniversary: anniversaryThisMonth?.length ?? 0,
    };
  });

  return (
    <Card className="h-[340px] max-lg:w-full lg:w-3/5">
      <CardHeader>
        <CardTitle className="text-sm">
          Birthdays and Anniversarys per month
        </CardTitle>
        <CardDescription className="text-xs">
          Showing the count of recent DOBs and Anniversary for each month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 10,
              bottom: 10,
            }}
            width={500}
            height={200}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="recentDOB"
              type="monotone"
              fill="var(--color-recentDOB)"
              fillOpacity={0.4}
              stroke="var(--color-recentDOB)"
              stackId="a"
            />
            <Area
              dataKey="recentAnniversary"
              type="monotone"
              fill="var(--color-recentAnniversary)"
              fillOpacity={0.4}
              stroke="var(--color-recentAnniversary)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
