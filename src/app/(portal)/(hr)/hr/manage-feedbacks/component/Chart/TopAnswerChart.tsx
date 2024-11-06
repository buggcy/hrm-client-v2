'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { ChartList } from '@/types/feedback.types';

export const description = 'A bar chart with a custom label';

const chartConfig = {
  count: {
    label: 'Count',
    color: 'hsl(var(--chart-5))',
  },
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig;
interface ChartProps {
  chartData?: ChartList[];
}

export function TopFeedbackAnswer({ chartData }: ChartProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm">Top Feedback Answers </CardTitle>
        <CardDescription className="text-xs">
          Feedback ratings represented as percentages relative to the highest
          count
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill={`var(--color-count)`}
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
