import React, { FunctionComponent } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { Leave } from './leave';

import { leaves } from '@/types/leave-history.types';

interface ConsumedLeavesProps {
  data: leaves;
}

const ConsumedLeaves: FunctionComponent<ConsumedLeavesProps> = ({ data }) => {
  const {
    totalTakenLeaves,
    totalAllowedLeaves,
    monthlyAllowedLeaved,
    annualAllowedLeaves,
    totalCasualLeaves,
    totalSickLeaves,
    totalAnnualLeaveCount,
  } = data;
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle className="text-base">Consumed Leave Types</CardTitle>
          <div className="mt-6">
            <ul className="flex max-w-64 flex-wrap gap-2 text-[10px]">
              <li>
                <strong>AL</strong>
                <span> - Annual Leave</span>
              </li>
              <li>
                <strong>SL</strong>
                <span> - Sick Leave</span>
              </li>
              <li>
                <strong>CL</strong>
                <span> - Casual Leave</span>
              </li>
              <li>
                <strong>PL</strong>
                <span> - Privilege Leave</span>
              </li>
            </ul>
          </div>
        </div>
        <Leave
          totalTakenLeaves={totalTakenLeaves}
          totalAllowedLeaves={totalAllowedLeaves}
        />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 text-xs">
          <div className="flex gap-2">
            <strong>AL</strong>
            <Progress
              value={(totalAnnualLeaveCount / annualAllowedLeaves) * 100}
              variant="primary"
            />
            <p>
              {totalAnnualLeaveCount}/{annualAllowedLeaves}
            </p>
          </div>
          <div className="flex gap-2">
            <strong>SL</strong>
            <Progress
              value={(totalSickLeaves / monthlyAllowedLeaved) * 100}
              variant="primary"
            />
            <p>
              {totalSickLeaves}/{monthlyAllowedLeaved}
            </p>
          </div>
          <div className="flex gap-2">
            <strong>CL</strong>
            <Progress
              value={(totalCasualLeaves / monthlyAllowedLeaved) * 100}
              variant="primary"
            />
            <p>
              {totalCasualLeaves}/{monthlyAllowedLeaved}
            </p>
          </div>
          <div className="flex gap-2">
            <strong>PL</strong>
            <Progress value={0} variant="primary" />
            <p>N/A</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsumedLeaves;
