'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { PerkRecords } from '@/types/perk.types';

export const description = 'A radial chart with stacked sections';
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const chartConfig = {
  approved: {
    label: 'Approved',
    color: 'hsl(var(--chart-1))',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-2))',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(var(--chart-3))',
  },
  available: {
    label: 'Available',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

interface PerkRecordChartProps {
  data: PerkRecords | undefined;
  month?: number;
}

export function PerkRecordChart({ data, month }: PerkRecordChartProps) {
  const monthName = month !== undefined ? monthNames[month - 1] : '';
  const chartData = [
    {
      month: monthName,
      approved: data?.totalApprovedPerks,
      pending: data?.totalPendingPerks,
      rejected: data?.totalRejectedPerks,
      available: data?.totalAvailablePerks,
    },
  ];

  const totalVisitors = data?.totalRecords || 0;

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square max-h-[200px] min-h-[150px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={-270}
        innerRadius={60}
        outerRadius={80}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy || 0}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {isNaN(totalVisitors - (data?.totalAvailablePerks || 0))
                        ? 0
                        : (
                            totalVisitors - (data?.totalAvailablePerks || 0)
                          )?.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 16}
                      className="fill-muted-foreground"
                    >
                      /{totalVisitors?.toLocaleString()}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="approved"
          stackId="a"
          fill="var(--color-approved)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="pending"
          fill="var(--color-pending)"
          stackId="a"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="rejected"
          fill="var(--color-rejected)"
          stackId="a"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="available"
          fill="var(--color-available)"
          stackId="a"
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
