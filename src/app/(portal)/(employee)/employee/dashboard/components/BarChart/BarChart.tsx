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

export interface ChartData {
  date: string | number | Date;
  Hours: number;
  status?: string;
  startTime?: string | number | Date;
  endTime?: string | number | Date;
}

export function BChart({ from, to }: { from: string; to: string }) {
  const userId = useUserId();
  const [isMonthlyView, setIsMonthlyView] = useState(true);
  const dateObject = new Date(from);
  const toObject = new Date(to);
  const monthName = dateObject.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
  const toMonth = toObject.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
  const {
    data: chartData,
    isLoading,
    isFetching,
  } = useAttendanceData(
    userId,
    { from, to },
    {
      enabled: !!from && !!userId,
    },
  );

  const placeholderData: ChartData[] = Array.from({ length: 7 }, (_, i) => ({
    date: (i + 1).toString(),
    Hours: 0,
    status: '',
    startTime: '',
    endTime: '',
  }));

  const getCurrentWeekData = (data: ChartData[] | undefined): ChartData[] => {
    if (!Array.isArray(data)) {
      return [];
    }

    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const startOfWeek = new Date(currentDate);

    startOfWeek.setDate(
      currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1),
    );

    startOfWeek.setHours(0, 0, 0, 0);

    return data.filter(item => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);

      return itemDate >= startOfWeek && itemDate <= currentDate;
    });
  };

  const currentWeekData =
    chartData && Array.isArray(chartData) ? getCurrentWeekData(chartData) : [];
  const dataToShow = isMonthlyView
    ? Array.isArray(chartData)
      ? chartData
      : []
    : currentWeekData;

  const chartConfig = {
    Hours: {
      label: 'Hours',
      color: '#000000',
    },
  };

  const inputDate = new Date(from);
  const inputMonth = inputDate.getMonth();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const isCurrentMonth = inputMonth === currentMonth;

  return (
    <Card className="lg:h-[570px]">
      <CardHeader className="flex justify-between">
        <div className="flex w-full items-center">
          <CardDescription className="mr-4 grow text-lg font-semibold text-black dark:text-white">
            Attendance Record of{' '}
            {monthName === toMonth ? monthName : `${monthName} to ${toMonth}`}
          </CardDescription>
          <div className="ml-4 flex items-center">
            <Tabs
              value={isMonthlyView ? 'monthly' : 'weekly'}
              onValueChange={value => setIsMonthlyView(value === 'monthly')}
            >
              <TabsList className="h-auto rounded-lg shadow-sm transition">
                <TabsTrigger
                  className="py-1 text-xs"
                  value="monthly"
                  disabled={!isCurrentMonth}
                >
                  Monthly
                </TabsTrigger>
                {isCurrentMonth && (
                  <TabsTrigger className="py-1 text-xs" value="weekly">
                    Weekly
                  </TabsTrigger>
                )}
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
                  const { date, Hours, status, startTime, endTime } =
                    payload[0].payload;
                  return (
                    <div className="grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                      <p>
                        <strong>Date:</strong>{' '}
                        {typeof date === 'string' ||
                        typeof date === 'number' ||
                        date instanceof Date
                          ? new Date(date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric',
                            })
                          : 'Invalid date'}
                      </p>
                      <p>
                        <strong>Hours:</strong> {Hours}
                      </p>
                      <p>
                        <strong>Status:</strong> {status}
                      </p>
                      <p>
                        <strong>Time:</strong> {startTime} - {endTime}
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
