'use client';
import React from 'react';

import { BirthdayAreaChart } from './BirthdayAreaChart';
import UpcomingAnniversaryCard from './UpcomingAnniversaryCard';
import UpcomingDobCard from './UpcomingDobCard';

function BirthdayChartPage() {
  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <BirthdayAreaChart />
      <UpcomingDobCard />
      <UpcomingAnniversaryCard />
    </div>
  );
}

export default BirthdayChartPage;
