'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Concerns() {
  const absenteeism = Math.floor(Math.random() * 20) + 1;
  const turnoverRate = (Math.random() * 10).toFixed(1);
  const pendingComplaints = Math.floor(Math.random() * 50);
  const overdueProjects = Math.floor(Math.random() * 15);

  return (
    <div className="col-span-1 flex size-full flex-col gap-4">
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Employee Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Absenteeism</p>
              <p className="text-2xl font-bold">{absenteeism}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Turnover Rate</p>
              <p className="text-2xl font-bold">{turnoverRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Company Concerns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Pending Complaints
              </p>
              <p className="text-2xl font-bold">{pendingComplaints}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Overdue Projects</p>
              <p className="text-2xl font-bold">{overdueProjects}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
