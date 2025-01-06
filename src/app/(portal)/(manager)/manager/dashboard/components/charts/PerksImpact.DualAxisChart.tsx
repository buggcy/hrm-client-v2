'use client';

import React from 'react';

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
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

const data = [
  {
    month: 'June',
    amountSpent: 150000,
    sickLeaves: 45,
    absentDays: 60,
    turnoverRate: 2.5,
    requestsSubmitted: 200,
    requestsApproved: 180,
    requestsRejected: 20,
  },
  {
    month: 'July',
    amountSpent: 160000,
    sickLeaves: 40,
    absentDays: 55,
    turnoverRate: 2.2,
    requestsSubmitted: 220,
    requestsApproved: 200,
    requestsRejected: 20,
  },
  {
    month: 'August',
    amountSpent: 170000,
    sickLeaves: 38,
    absentDays: 50,
    turnoverRate: 2.0,
    requestsSubmitted: 240,
    requestsApproved: 220,
    requestsRejected: 20,
  },
  {
    month: 'September',
    amountSpent: 180000,
    sickLeaves: 35,
    absentDays: 48,
    turnoverRate: 1.8,
    requestsSubmitted: 260,
    requestsApproved: 240,
    requestsRejected: 20,
  },
  {
    month: 'October',
    amountSpent: 190000,
    sickLeaves: 32,
    absentDays: 45,
    turnoverRate: 1.5,
    requestsSubmitted: 280,
    requestsApproved: 260,
    requestsRejected: 20,
  },
  {
    month: 'November',
    amountSpent: 200000,
    sickLeaves: 30,
    absentDays: 40,
    turnoverRate: 1.2,
    requestsSubmitted: 300,
    requestsApproved: 280,
    requestsRejected: 20,
  },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-background p-4 shadow-lg">
        <p className="font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}:{' '}
            {entry.name === 'Amount Spent'
              ? entry.value?.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'PKR',
                })
              : entry.name === 'Turnover Rate'
                ? `${entry.value}%`
                : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PerksImpactChart() {
  return (
    <Card className="col-span-1 hidden w-full md:col-span-2 md:block">
      <CardHeader>
        <CardTitle>Perks Impact and Request Trends (Last 6 Months)</CardTitle>
        <CardDescription>
          Overview of perk impact on employee metrics and request statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 40,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              yAxisId="left"
              orientation="left"
              label={{
                value: 'Impact Metrics',
                angle: -90,
                position: 'insideLeft',
                dx: -30,
                dy: 30,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'Number of Requests',
                angle: 90,
                position: 'insideRight',
                dx: 5,
                dy: 50,
              }}
            />
            <Tooltip
              content={
                <CustomTooltip
                  active={undefined}
                  payload={undefined}
                  label={undefined}
                />
              }
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="amountSpent"
              fill="#8884d8"
              name="Amount Spent"
            />
            <Bar
              yAxisId="left"
              dataKey="sickLeaves"
              fill="#82ca9d"
              name="Sick Leaves"
            />
            <Bar
              yAxisId="left"
              dataKey="absentDays"
              fill="#ffc658"
              name="Absent Days"
            />
            <Bar
              yAxisId="left"
              dataKey="turnoverRate"
              fill="#ff7300"
              name="Turnover Rate"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="requestsSubmitted"
              stroke="#8884d8"
              strokeWidth={2}
              name="Requests Submitted"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="requestsApproved"
              stroke="#82ca9d"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Requests Approved"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="requestsRejected"
              stroke="#ff7300"
              strokeWidth={2}
              strokeDasharray="3 4 5 2"
              name="Requests Rejected"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
