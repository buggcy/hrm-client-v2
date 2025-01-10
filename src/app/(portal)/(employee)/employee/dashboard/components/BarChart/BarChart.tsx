import { useState } from 'react';

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useAttendanceData } from '@/hooks/employee/useAttendenceData.hook';
import { useUserId } from '@/hooks/employee/useUserId';
import { getCurrentMonthName } from '@/utils';

export interface ChartData {
  date: string | number | Date;
  Hours: number;
}

export function BChart() {
  const userId = useUserId();
  const [isMonthlyView, setIsMonthlyView] = useState(true);
  const currentMonthName = getCurrentMonthName();

  const { data: chartData, isLoading, isFetching } = useAttendanceData(userId);
  const placeholderData: ChartData[] = Array.from({ length: 7 }, (_, i) => ({
    date: (i + 1).toString(),
    Hours: 0,
  }));

  const getCurrentWeekData = (data: ChartData[] | undefined): ChartData[] => {
    if (!Array.isArray(data)) {
      return [];
    }
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const startOfWeek = new Date(currentDate);

    startOfWeek.setDate(currentDate.getDate() - currentDay + 1);

    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfWeek && itemDate <= currentDate;
    });
  };

  const currentWeekData = getCurrentWeekData(chartData);
  const dataToShow = isMonthlyView ? chartData || [] : currentWeekData;

  const chartConfig = {
    Hours: {
      label: 'Hours',
      color: '#000000',
    },
  };

  return (
    <Card className="lg:h-[570px]">
      <CardHeader className="flex justify-between">
        <div className="flex w-full items-center">
          <CardDescription className="mr-4 grow text-lg font-semibold text-black dark:text-white">
            Attendance Record of {currentMonthName}
          </CardDescription>
          <div className="ml-4 flex items-center">
            <Tabs
              value={isMonthlyView ? 'monthly' : 'weekly'}
              onValueChange={value => setIsMonthlyView(value === 'monthly')}
            >
              <TabsList className="h-auto rounded-lg shadow-sm transition">
                <TabsTrigger className="py-1 text-xs" value="monthly">
                  Monthly
                </TabsTrigger>
                <TabsTrigger className="py-1 text-xs" value="weekly">
                  Weekly
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-full pl-0 lg:h-[450px]">
        <ChartContainer
          config={chartConfig}
          className="h-full lg:aspect-auto lg:h-[450px] lg:max-w-[1000px]"
        >
          <BarChart
            data={isLoading || isFetching ? placeholderData : dataToShow}
            width={600}
            height={300}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const { date, Hours } = payload[0].payload;
                  return (
                    <div className="grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                      <p>
                        <strong>Date:</strong> {date}
                      </p>
                      <p>
                        <strong>Hours:</strong> {Hours}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="Hours" fill="#30BBF2" barSize={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
