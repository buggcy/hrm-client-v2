'use client';

import * as React from 'react';

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const projectProgressData = [
  {
    projectId: '1',
    projectName: 'Xoro',
    progress: [
      { month: 'january', progress: 0 },
      { month: 'february', progress: 15 },
      { month: 'march', progress: 50 },
      { month: 'april', progress: 70 },
      { month: 'may', progress: 95 },
      { month: 'june', progress: 100 },
    ],
  },
  {
    projectId: '2',
    projectName: 'Yolo',
    progress: [
      { month: 'january', progress: 0 },
      { month: 'february', progress: 10 },
      { month: 'march', progress: 30 },
      { month: 'april', progress: 60 },
      { month: 'may', progress: 90 },
      { month: 'june', progress: 100 },
    ],
  },
  {
    projectId: '3',
    projectName: 'Zeta',
    progress: [
      { month: 'january', progress: 0 },
      { month: 'february', progress: 20 },
      { month: 'march', progress: 40 },
      { month: 'april', progress: 80 },
      { month: 'may', progress: 95 },
      { month: 'june', progress: 100 },
    ],
  },
];

const chartConfig = {
  progress: {
    label: 'Progress',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ProjectProgress() {
  const [selectedProject, setSelectedProject] = React.useState(
    projectProgressData[0].projectId,
  );

  const projectData = React.useMemo(
    () =>
      projectProgressData.find(project => project.projectId === selectedProject)
        ?.progress || [],
    [selectedProject],
  );

  return (
    <Card className="col-span-1 flex flex-col justify-between">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>Monthly Progress Report</CardDescription>
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a project"
          >
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {projectProgressData.map(project => (
              <SelectItem
                key={project.projectId}
                value={project.projectId}
                className="rounded-lg [&_span]:flex"
              >
                {project.projectName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto size-full max-h-[280px] min-h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={projectData}
              margin={{ top: 26, left: -22, right: 16 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={value => value.slice(0, 3)}
                className="capitalize"
              />
              <YAxis
                dataKey="progress"
                domain={[0, 100]}
                tickFormatter={value => `${value}%`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    className="capitalize"
                  />
                }
              />
              <Line
                dataKey="progress"
                type="monotone"
                stroke="var(--color-progress)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-progress)' }}
                activeDot={{ r: 6 }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => `${value}%`}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
