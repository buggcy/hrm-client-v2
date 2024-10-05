import { useState } from 'react';

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
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
    <Card>
      <CardHeader className="flex justify-between">
        <div className="flex w-full items-center">
          <CardDescription className="mr-4 grow text-lg font-bold text-black dark:text-white">
            Attendance Record of {currentMonthName}
          </CardDescription>
          <div className="ml-4 flex items-center">
            <Tabs
              value={isMonthlyView ? 'monthly' : 'weekly'}
              onValueChange={value => setIsMonthlyView(value === 'monthly')}
            >
              <TabsList className="rounded-lg shadow-sm transition">
                <TabsTrigger
                  value="monthly"
                  className={`${isMonthlyView ? 'rounded-lg text-white' : 'rounded-lg bg-gray-100 text-gray-700'} p-2`}
                >
                  monthly
                </TabsTrigger>
                <TabsTrigger
                  value="weekly"
                  className={`${!isMonthlyView ? 'rounded-lg text-white' : 'rounded-lg bg-gray-100 text-gray-700'} p-2`}
                >
                  weekly
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-full pl-0">
        <ChartContainer config={chartConfig} className="h-full">
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
              content={<ChartTooltipContent />}
              formatter={(value: number) => `${value} Hours`}
            />
            <Bar dataKey="Hours" fill="#30BBF2" barSize={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
