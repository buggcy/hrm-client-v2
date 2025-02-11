'use client';
import { FunctionComponent, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Button } from '@/components/ui/button';
import { useStores } from '@/providers/Store.Provider';

import {
  useHrPerkRecordQuery,
  useHrPerkRequestsQuery,
} from '@/hooks/hrPerksList/useHrPerksList.hook';
import { AuthStoreType } from '@/stores/auth';
import { PerkListStoreType } from '@/stores/hr/perk-list';
import { formatedDate } from '@/utils';

import { PerkRequests } from './components/charts/PerkRequestsStats';
import { PerkStats } from './components/charts/PerkStats';
import { TopPerks } from './components/charts/TopPerks';
import PerkTable from './components/HrPerksRequestsTable.component';

interface AddPerksProps {}

const AddPerksPage: FunctionComponent<AddPerksProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const { perkListStore } = useStores() as { perkListStore: PerkListStoreType };
  const { setRefetchPerkList, refetchPerkList } = perkListStore;

  const router = useRouter();
  const { data: perkRequests } = useHrPerkRequestsQuery({
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
  });
  const { data: hrPerkRecords, refetch: refetchRecord } =
    useHrPerkRecordQuery();
  useEffect(() => {
    if (refetchPerkList) {
      void (async () => {
        await refetchRecord();
      })();

      setRefetchPerkList(false);
    }
  }, [refetchPerkList, setRefetchPerkList, refetchRecord]);

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Perks & Benefits">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8 px-2">
        <Header subheading="Empower your team with perks that inspire and benefits that last.">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() =>
              router.push(
                `/${user?.roleId === 3 ? 'manager' : 'hr'}/manage-perks/perk-requests`,
              )
            }
          >
            View Approval Requests
            <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
              {perkRequests?.data.length || 0}
            </span>
          </Button>
        </Header>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TopPerks chartData={hrPerkRecords?.topAvailed} />
          <PerkStats
            totalPerks={hrPerkRecords?.records?.totalPerks}
            assignedPerks={hrPerkRecords?.records?.totalPerkAssigned}
            approvedPerks={hrPerkRecords?.records?.totalApprovedPerks}
            rejectedPerks={hrPerkRecords?.records?.totalRejectedPerks}
          />
          <PerkRequests chartData={hrPerkRecords?.chartData} />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <PerkTable selectedDate={selectedDate} />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default AddPerksPage;
