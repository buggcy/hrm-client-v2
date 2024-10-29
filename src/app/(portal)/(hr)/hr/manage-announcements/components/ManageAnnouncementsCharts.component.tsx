import { FunctionComponent, useEffect } from 'react';

import { useMutation } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';

import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { getAnnouncementStats } from '@/services/hr/manage-announcements.service';
import { AuthStoreType } from '@/stores/auth';
import { AnnouncementsStoreType } from '@/stores/hr/announcements';

import { AnnouncementSummaryChart } from './charts/AnnouncementSummary';
import { PriorityDistribution } from './charts/PriorityDistribution';
import RecentAnnouncements from './charts/RecentAnnouncements';

interface AttendanceCardsProps {
  dates?: DateRange;
}

const ManageAnnouncementsCharts: FunctionComponent<AttendanceCardsProps> = ({
  dates,
}) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const { manageAnnouncementsStore } = useStores() as {
    manageAnnouncementsStore: AnnouncementsStoreType;
  };
  const { refetchAnnouncements, setRefetchAnnouncements } =
    manageAnnouncementsStore;

  const {
    mutate,
    data: announcementStats,
    isPending,
  } = useMutation({
    mutationFn: ({ from, to }: { from?: string; to?: string }) =>
      getAnnouncementStats({
        from,
        to,
      }),
    onError: err => {
      toast({
        title: 'Error',
        description: err?.message || 'Error on fetching stats data!',
        variant: 'error',
      });
    },
  });

  useEffect(() => {
    if (refetchAnnouncements) {
      mutate({
        from: dates?.from?.toISOString(),
        to: dates?.to?.toISOString(),
      });
      setRefetchAnnouncements(false);
    }
  }, [dates, user, mutate, refetchAnnouncements, setRefetchAnnouncements]);

  useEffect(() => {
    if (user) {
      mutate({
        from: dates?.from?.toISOString(),
        to: dates?.to?.toISOString(),
      });
    }
  }, [dates, user, mutate]);
  return (
    <div className="grid w-full grid-cols-1 gap-y-4 lg:grid-cols-3 lg:gap-x-4">
      <PriorityDistribution data={announcementStats?.priorityStats} />
      <AnnouncementSummaryChart data={announcementStats?.statsSummary} />
      <RecentAnnouncements
        announcements={announcementStats?.latestAnnouncements}
        isFetching={isPending}
      />
    </div>
  );
};

export default ManageAnnouncementsCharts;
