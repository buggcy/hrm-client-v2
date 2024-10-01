import React, { FunctionComponent } from 'react';

import ConsumedLeaves from './charts/ConsumedLeaves';
import LeavePattern from './charts/LeavePattern';
import MonthlyStats from './charts/MonthlyStats';

import { LeaveApiResponse } from '@/types/leave-history.types';

interface LeaveCardsProps {
  data?: LeaveApiResponse;
}

const LeaveCards: FunctionComponent<LeaveCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:mb-8 md:grid-cols-3">
      <LeavePattern data={data?.dayOfWeekCount} />
      <MonthlyStats data={data?.monthCount} />
      <ConsumedLeaves data={data?.leaves} />
    </div>
  );
};

export default LeaveCards;
