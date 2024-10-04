import { useQuery } from '@tanstack/react-query';

import { fetchRecentAnnouncements } from '@/services/employee/dashboard.service';

export const useRecentAnnouncements = () => {
  return useQuery({
    queryKey: ['recent-announcements'],
    queryFn: () => fetchRecentAnnouncements(),
    refetchInterval: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
