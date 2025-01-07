import { Thermometer, TrendingDown, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmployeeImpactProps {
  performanceScore: number;
  performanceChange: number;
  sickLeaves: number;
  sickLeavesChange: number;
}

export function EmployeeImpactCard({
  performanceScore,
  performanceChange,
  sickLeaves,
  sickLeavesChange,
}: EmployeeImpactProps) {
  return (
    <Card className="col-span-1 block w-full md:hidden">
      <CardHeader>
        <CardTitle className="text-lg">Employee Impact Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Performance Score</span>
            <span className="text-2xl font-bold">{performanceScore}%</span>
          </div>
          <div className="flex items-center text-sm">
            {performanceChange > 0 ? (
              <TrendingUp className="mr-1 size-4 text-success" />
            ) : (
              <TrendingDown className="mr-1 size-4 text-error" />
            )}
            <span
              className={performanceChange > 0 ? 'text-success' : 'text-error'}
            >
              {performanceChange > 0 ? '+' : ''}
              {performanceChange}%
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Sick Leaves</span>
            <span className="text-2xl font-bold">{sickLeaves} days</span>
          </div>
          <div className="flex items-center text-sm">
            <Thermometer className="mr-1 size-4 text-muted-foreground" />
            <span
              className={sickLeavesChange <= 0 ? 'text-success' : 'text-error'}
            >
              {sickLeavesChange > 0 ? '+' : ''}
              {sickLeavesChange}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
