import { FunctionComponent } from 'react';

import { PerkRequests } from './charts/PerkRequestsStats';
import { PerkStats } from './charts/PerkStats';
import { TopPerks } from './charts/TopPerks';

interface PerkChartsProps {}

const PerkCharts: FunctionComponent<PerkChartsProps> = () => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <TopPerks />
      <PerkStats />
      <PerkRequests />
    </div>
  );
};

export default PerkCharts;
