// 'use client';

// import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from '@/components/ui/chart';

// export const description = 'A radial chart with stacked sections';

// const chartConfig = {
//   enabled: {
//     label: 'Enabled',
//     color: 'hsl(var(--chart-1))',
//   },

//   disabled: {
//     label: 'Disabled',
//     color: 'hsl(var(--chart-3))',
//   },
// } satisfies ChartConfig;
// const data = {
//   totalCount: 4,
//   enabledCount: 2,
//   disabledCount: 2,
// };

// export function FeedbackDistributionChart() {
//   const chartData = [
//     {
//       month: 'january',
//       pending: data?.enabledCount,
//       approved: data?.disabledCount,
//     },
//   ];
//   const totalVisitors = data?.totalCount || 0;

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="pb-0">
//         <CardTitle className="text-sm">Feedback Status</CardTitle>
//       </CardHeader>
//       <CardContent className="flex size-full flex-col">
//         <div className="flex size-full items-center justify-between">
//           <div className="flex flex-col gap-4 text-nowrap">
//             <div className="flex items-center gap-2">
//               <div className="size-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
//               <p className="font-semibold">
//                 {data?.enabledCount}
//                 <span className="ml-1 text-sm font-medium text-slate-400">
//                   Enabled
//                 </span>
//               </p>
//             </div>

//             <div className="flex items-center gap-2">
//               <div className="size-2 rounded-full bg-[hsl(var(--chart-3))]"></div>
//               <p className="font-semibold">
//                 {data?.disabledCount}
//                 <span className="ml-1 text-sm font-medium text-slate-400">
//                   Disabled
//                 </span>
//               </p>
//             </div>
//           </div>
//           <ChartContainer
//             config={chartConfig}
//             className="ml-auto aspect-square w-full max-w-[250px]"
//           >
//             <RadialBarChart
//               data={chartData}
//               startAngle={90}
//               endAngle={-270}
//               innerRadius={60}
//               outerRadius={90}
//             >
//               <ChartTooltip
//                 cursor={false}
//                 content={<ChartTooltipContent hideLabel />}
//               />

//               <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
//                 <Label
//                   content={({ viewBox }) => {
//                     if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
//                       return (
//                         <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
//                           <tspan
//                             x={viewBox.cx}
//                             y={(viewBox.cy || 0) - 16}
//                             className="fill-foreground text-2xl font-bold"
//                           >
//                             {totalVisitors.toLocaleString()}
//                           </tspan>
//                           <tspan
//                             x={viewBox.cx}
//                             y={(viewBox.cy || 0) + 4}
//                             className="fill-muted-foreground"
//                           >
//                             Total
//                           </tspan>
//                         </text>
//                       );
//                     }
//                   }}
//                 />
//               </PolarRadiusAxis>
//               <RadialBar
//                 dataKey="enabled"
//                 stackId="a"
//                 fill="var(--color-enabled)"
//                 className="stroke-transparent stroke-2"
//               />
//               <RadialBar
//                 dataKey="disabled"
//                 fill="var(--color-disabled)"
//                 stackId="a"
//                 className="stroke-transparent stroke-2"
//               />
//             </RadialBarChart>
//           </ChartContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

'use client';

import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A pie chart with a label';

const chartConfig = {
  feedback: {
    label: 'Feedback',
  },
  disabled: {
    label: 'Disabled',
    color: 'hsl(var(--chart-3))',
  },

  enabled: {
    label: 'Enabled',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface ChartProps {
  totalEnabled?: number;
  totalDisabled?: number;
}
export function FeedbackDistributionChart({
  totalDisabled,
  totalEnabled,
}: ChartProps) {
  const chartData = [
    {
      active: 'enabled',
      status: totalEnabled || 0,
      fill: 'var(--color-enabled)',
    },

    {
      active: 'disabled',
      status: totalDisabled || 0,
      fill: 'var(--color-disabled)',
    },
  ];
  return (
    <Card className="flex w-full flex-col">
      <CardHeader>
        <CardTitle>Feedback Overview</CardTitle>
      </CardHeader>
      <CardContent className="w-full p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px] pb-2 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie data={chartData} dataKey="status" label nameKey="active" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
