'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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
const chartData = [
  {
    month: 'January',
    complaintsReceived: 186,
    complaintsResolved: 80,
    feedbackQuestions: 20,
    feedbackResponses: 10,
  },
  {
    month: 'February',
    complaintsReceived: 285,
    complaintsResolved: 100,
    feedbackQuestions: 30,
    feedbackResponses: 15,
  },
  {
    month: 'March',
    complaintsReceived: 180,
    complaintsResolved: 70,
    feedbackQuestions: 25,
    feedbackResponses: 12,
  },
  {
    month: 'April',
    complaintsReceived: 200,
    complaintsResolved: 90,
    feedbackQuestions: 35,
    feedbackResponses: 18,
  },
  {
    month: 'May',
    complaintsReceived: 250,
    complaintsResolved: 120,
    feedbackQuestions: 40,
    feedbackResponses: 20,
  },
  {
    month: 'June',
    complaintsReceived: 300,
    complaintsResolved: 150,
    feedbackQuestions: 45,
    feedbackResponses: 25,
  },
];

const chartConfig = {
  complaintsReceived: {
    label: 'Complaints Received',
    color: 'hsl(var(--chart-3))',
  },
  complaintsResolved: {
    label: 'Complaints Resolved',
    color: 'hsl(var(--chart-1))',
  },
  feedbackQuestions: {
    label: 'Feedback Questions',
    color: 'hsl(var(--chart-2))',
  },
  feedbackResponses: {
    label: 'Feedback Responses',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function ComplaintsDistribution() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Complaints & Feedback Overview</CardTitle>
        <CardDescription>
          Monthly breakdown of complaints and feedback metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="complaintsReceived"
              fill="var(--color-complaintsReceived)"
              radius={4}
            />
            <Bar
              dataKey="complaintsResolved"
              fill="var(--color-complaintsResolved)"
              radius={4}
            />
            <Bar
              dataKey="feedbackQuestions"
              fill="var(--color-feedbackQuestions)"
              radius={4}
            />
            <Bar
              dataKey="feedbackResponses"
              fill="var(--color-feedbackResponses)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
