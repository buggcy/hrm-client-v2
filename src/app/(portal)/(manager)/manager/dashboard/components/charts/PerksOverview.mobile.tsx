import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PerksOverviewProps {
  totalSpent: number;
  approvedRequests: number;
  rejectedRequests: number;
}

export function PerksOverviewCard({
  totalSpent,
  approvedRequests,
  rejectedRequests,
}: PerksOverviewProps) {
  const totalRequests = approvedRequests + rejectedRequests;
  const approvalRate = (approvedRequests / totalRequests) * 100;

  return (
    <Card className="col-span-1 block w-full md:hidden">
      <CardHeader>
        <CardTitle className="text-lg">Perks and Benefits Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">
            {totalSpent.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'PKR',
            })}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Requests Approved/Rejected</span>
            <span className="font-medium">
              {approvedRequests}/{rejectedRequests}
            </span>
          </div>
          <Progress value={approvalRate} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Total Requests: {totalRequests}</span>
            <span>Approval Rate: {approvalRate.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
