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

// Sample data for the chart
const departmentData = [
  { department: 'Sales', complaints: 45, resolutionRate: 80, turnovers: 5 },
  { department: 'HR', complaints: 20, resolutionRate: 95, turnovers: 2 },
  {
    department: 'Engineering',
    complaints: 30,
    resolutionRate: 85,
    turnovers: 8,
  },
  { department: 'Marketing', complaints: 25, resolutionRate: 90, turnovers: 3 },
  { department: 'Finance', complaints: 15, resolutionRate: 100, turnovers: 1 },
  {
    department: 'Customer Support',
    complaints: 60,
    resolutionRate: 75,
    turnovers: 10,
  },
];

export default function ComplaintsDistribution() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Complaints Overview</CardTitle>
        <CardDescription>
          Complaints, Resolution Rates, and Turnovers by Department (Q4 2024)
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
            turnovers: {
              label: 'Turnovers',
              color: 'hsl(var(--chart-3))',
            },
          }}
          className="h-[200px] w-full"
        >
          <ResponsiveContainer>
            <ComposedChart
              data={departmentData}
              margin={{ top: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="var(--color-complaints)"
                label={{
                  value: 'Complaints',
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
                  value: 'Resolution Rate',
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
                dataKey="turnovers"
                fill="var(--color-turnovers)"
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
