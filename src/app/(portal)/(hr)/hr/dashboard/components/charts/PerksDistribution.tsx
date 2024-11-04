'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { HrStatsPerkDistributionData } from '@/libs/validations/hr-dashboard';
import { cn } from '@/utils';

export const description = 'A radar chart with a custom label';

const chartConfig = {
  approved: {
    label: 'Approved',
    color: 'hsl(var(--chart-1))',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(var(--chart-3))',
  },
  approvedAmount: {
    label: 'Approved Amount',
    color: 'hsl(var(--chart-1))',
  },
  rejectedAmount: {
    label: 'Rejected Amount',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

interface PerksDistributionProps {
  data?: HrStatsPerkDistributionData[];
}

export function PerksDistribution({ data }: PerksDistributionProps) {
  const transformedData = data?.map(item => ({
    ...item,
    approved: item.approved || 0.1, // minimum threshold for display
    rejected: item.rejected || 0.1,
    approvedAmount: item.approvedAmount || 0.1,
    rejectedAmount: item.rejectedAmount || 0.1,
  }));
  return (
    <Card className="col-span-1">
      <CardHeader className="items-center pb-0">
        <CardTitle>Perk Requests</CardTitle>
        <CardDescription>
          Showing total requests for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full lg:pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[310px]"
        >
          <RadarChart
            data={transformedData}
            margin={{
              top: 10,
              right: 10,
              bottom: 10,
              left: 10,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name, { payload }) => {
                    return (
                      <div className="flex flex-col gap-1.5">
                        {name === 'approved' && (
                          <div className="flex flex-row items-center gap-1">
                            <div className="h-full w-1 bg-[hsl(var(--chart-1))]"></div>
                            <span>Total Approved Amount: </span>
                            <strong>
                              {parseInt(payload.approvedAmount as string, 10)}{' '}
                              Rs
                            </strong>
                          </div>
                        )}
                        {name === 'rejected' && (
                          <div className="flex flex-row items-center gap-1">
                            <div className="h-full w-1 bg-[hsl(var(--chart-3))]"></div>
                            <span>Total Rejected Amount: </span>
                            <strong>
                              {parseInt(payload.rejectedAmount as string, 10)}{' '}
                              Rs
                            </strong>
                          </div>
                        )}
                        <div className="flex flex-row items-center gap-1">
                          <div
                            className={cn(
                              `h-full w-1 bg-[hsl(var(--chart-${name === 'approved' ? 1 : 3}))]`,
                            )}
                          ></div>
                          <span className="capitalize">
                            Total {name} Requests:{' '}
                          </span>
                          <strong>{parseInt(value as string, 10)}</strong>
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />
            <PolarAngleAxis
              dataKey="month"
              tick={({ x, y, textAnchor, index, ...props }) => {
                const chartData = data
                  ? data[index]
                  : { approved: '', rejected: '', month: '' };

                return (
                  <text
                    x={x}
                    y={index === 0 ? y - 10 : y}
                    textAnchor={textAnchor}
                    fontSize={13}
                    fontWeight={500}
                    {...props}
                  >
                    <tspan className="fill-foreground">
                      {chartData.approved}
                    </tspan>
                    <tspan className="fill-muted-foreground">/</tspan>
                    <tspan className="fill-foreground">
                      {chartData.rejected}
                    </tspan>
                    <tspan
                      x={x}
                      dy={'1rem'}
                      fontSize={12}
                      className="fill-muted-foreground"
                    >
                      {chartData.month}
                    </tspan>
                  </text>
                );
              }}
            />

            <PolarGrid />
            <Radar
              dataKey="approved"
              fill="var(--color-approved)"
              fillOpacity={0.6}
            />
            <Radar dataKey="rejected" fill="var(--color-rejected)" />
            <ChartLegend
              className="mt-16"
              content={<ChartLegendContent className="mt-16" />}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
