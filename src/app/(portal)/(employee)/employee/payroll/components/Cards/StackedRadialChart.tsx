'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface StackedRadialChartProps {
  netSalary: number;
  totalDeductions: number;
  totalIncrements: number;
  date: string;
}

export const StackedRadialChart: React.FC<StackedRadialChartProps> = ({
  netSalary,
  totalDeductions,
  totalIncrements,
  date,
}) => {
  const chartData = [
    {
      month: 'Latest Month',
      desktop: netSalary,
      mobile: totalDeductions,
      increments: totalIncrements,
    },
  ];

  const formatMonthName = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const monthName = formatMonthName(date);

  const chartConfig = {
    desktop: {
      label: 'Net Salary',
      color: 'hsl(120, 100%, 40%)',
    },
    mobile: {
      label: 'Total Deductions',
      color: 'hsl(0, 100%, 50%)',
    },
    increments: {
      label: 'Total Increments',
      color: 'hsl(240, 100%, 50%)',
    },
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-PK', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`;
  };
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-[16px] lg:text-[20px] xl:text-[27px]">
          Salary Distribution
        </CardTitle>
        <CardDescription className="text-[12px] lg:text-[13px] xl:text-[16px]">
          {monthName}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={360}
            innerRadius={70}
            outerRadius={110}
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
                          y={(viewBox.cy || 0) - 1}
                          className="fill-foreground text-[17px] font-bold"
                        >
                          {formatCurrency(netSalary)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 18}
                          className="fill-muted-foreground"
                        >
                          Net Salary
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="desktop"
              stackId="a"
              fill="var(--color-desktop)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="mobile"
              fill="var(--color-mobile)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="increments"
              fill={chartConfig.increments.color}
              stackId="a"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-sm font-medium leading-none">
          Total Deductions: Rs. {totalDeductions.toLocaleString()}
        </div>

        <div className="text-sm leading-none text-muted-foreground">
          Total increments: {formatCurrency(totalIncrements)}{' '}
        </div>
      </CardFooter>
    </Card>
  );
};
