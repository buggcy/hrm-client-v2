'use client';

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

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
} from '@/components/ui/chart';

interface Item {
  month: string;
  year: number;
  approvedMinutes: number;
  rejectedMinutes: number;
}

interface MonthlyGraphProps {
  data: Item[];
}

export function MonthlyOvertimeGraph({ data }: MonthlyGraphProps) {
  const chartConfig = {
    approvedMinutes: {
      label: 'Approved Minutes',
      color: 'hsl(var(--chart-1))',
    },
    rejectedMinutes: {
      label: 'Rejected Minutes',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Overtime Statistics</CardTitle>
        <CardDescription className="text-sm">
          Showing total overtime approved and rejected minutes for the year of{' '}
          {data[0]?.year}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full pr-0">
        <ChartContainer
          config={chartConfig}
          className="max-h-[200px] min-h-[100px] w-full"
        >
          <BarChart data={data} margin={{ left: 0, right: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickFormatter={value => value.slice(0, 3)}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="approvedMinutes" fill="hsl(var(--chart-1))" />
            <Bar dataKey="rejectedMinutes" fill="hsl(var(--chart-3))" />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
