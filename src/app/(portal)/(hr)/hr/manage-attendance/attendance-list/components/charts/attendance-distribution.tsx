'use client';

import { useEffect, useState } from 'react';

import { Pie, PieChart } from 'recharts';

import { DatePicker } from '@/components/DatePicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { getAttendanceDistributionStats } from '@/services/hr/attendance-list.service';

import { AttendanceDistributionApiResponse } from '@/types/attendance-list.types';

export const description = 'A pie chart with a label';

const chartConfig = {
  employee: {
    label: 'Employee',
  },
  present: {
    label: 'Present',
    color: 'hsl(var(--chart-1))',
  },
  absent: {
    label: 'Absent',
    color: 'hsl(var(--chart-2))',
  },
  leave: {
    label: 'Leave',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const fetchData = async (date: Date) => {
  const data: AttendanceDistributionApiResponse =
    await getAttendanceDistributionStats({
      date: date,
    });
  return data;
};

export function AttendanceDistribution() {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState<AttendanceDistributionApiResponse | null>(
    null,
  );
  useEffect(() => {
    void fetchData(date).then(setData);
  }, [date]);
  const chartData = [
    {
      status: 'present',
      employee: data?.totalPresent || 0,
      fill: 'var(--color-present)',
    },
    {
      status: 'absent',
      employee: data?.totalAbsent || 0,
      fill: 'var(--color-absent)',
    },
    {
      status: 'leave',
      employee: data?.totalLeave || 0,
      fill: 'var(--color-leave)',
    },
  ];
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle className="pb-4 text-base">Attendance Overview</CardTitle>
        <DatePicker date={date} setDate={setDate} />
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie data={chartData} dataKey="employee" label nameKey="status" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
