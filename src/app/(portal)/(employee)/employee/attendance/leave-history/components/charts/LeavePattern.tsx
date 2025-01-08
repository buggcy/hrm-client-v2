'use client';

import React, { FunctionComponent } from 'react';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { dayOfWeekCount } from '@/types/leave-history.types';

export const description = 'A bar chart';

const chartConfig = {
  leaves: {
    label: 'Leaves',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

interface LeavePatternProps {
  data: dayOfWeekCount | undefined;
}

const LeavePattern: FunctionComponent<LeavePatternProps> = ({ data }) => {
  const chartData = [
    { day: 'Monday', leaves: data?.Monday || 0 },
    { day: 'Tuesday', leaves: data?.Tuesday || 0 },
    { day: 'Wednesday', leaves: data?.Wednesday || 0 },
    { day: 'Thursday', leaves: data?.Thursday || 0 },
    { day: 'Friday', leaves: data?.Friday || 0 },
    { day: 'Saturday', leaves: data?.Saturday || 0 },
    { day: 'Sunday', leaves: data?.Sunday || 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weekly Stats</CardTitle>
      </CardHeader>
      <CardContent className="h-full grow">
        <ChartContainer
          config={chartConfig}
          className="h-5/6 min-h-[100px] w-full lg:h-3/4"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
              width={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickCount={5}
              width={20}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="leaves"
              fill="var(--color-leaves)"
              radius={4}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LeavePattern;
