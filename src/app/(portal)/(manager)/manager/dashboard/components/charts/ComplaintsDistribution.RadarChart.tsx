'use client';

import React from 'react';

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
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
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

import { ManagerComplaintStatsType } from '@/libs/validations/manager-dashboard';

export default function ComplaintsDistribution({
  complaintStats,
}: {
  complaintStats: ManagerComplaintStatsType[];
}) {
  const sortedData = complaintStats
    ? [...complaintStats].sort(
        (a, b) => a.year - b.year || a.monthNum - b.monthNum,
      )
    : [];

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Complaints Overview</CardTitle>
        <CardDescription>
          Complaints, Resolution Rates, and Turnovers (Last 6 Months)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            complaints: {
              label: 'Complaints',
              color: 'hsl(var(--chart-1))',
            },
            resolutionRate: {
              label: 'Resolution Rate',
              color: 'hsl(var(--chart-2))',
            },
            turnover: {
              label: 'Turnover',
              color: 'hsl(var(--chart-3))',
            },
          }}
          className="h-[250px] w-full"
        >
          <ResponsiveContainer>
            <ComposedChart data={sortedData} margin={{ top: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="var(--color-complaints)"
                label={{
                  value: 'Complaints & Turnovers',
                  angle: -90,
                  position: 'insideLeft',
                  dx: 10,
                  dy: 30,
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="var(--color-resolutionRate)"
                label={{
                  value: 'Resolution Rate (%)',
                  angle: 90,
                  position: 'insideRight',
                  dx: 0,
                  dy: 50,
                }}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">{label}</div>
                          <div className="font-medium">Value</div>
                          {payload.map((entry, index) => (
                            <React.Fragment key={`item-${index}`}>
                              <div style={{ color: entry.color }}>
                                {entry.name}
                              </div>
                              <div>
                                {entry.value}
                                {entry.name === 'Resolution Rate' ? '%' : ''}
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar
                dataKey="complaints"
                fill="var(--color-complaints)"
                yAxisId="left"
              />
              <Bar
                dataKey="turnover"
                fill="var(--color-turnover)"
                yAxisId="left"
              />
              <Line
                type="monotone"
                dataKey="resolutionRate"
                stroke="var(--color-resolutionRate)"
                yAxisId="right"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
