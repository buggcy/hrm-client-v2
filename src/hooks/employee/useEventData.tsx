import { useQuery } from '@tanstack/react-query';

import { fetchCurrentMonthEvents } from '@/services/employee/dashboard.service';

import { EventData } from '@/types/events.types';

export const useEventsData = () => {
  return useQuery<EventData[], Error>({
    queryKey: ['events'],
    queryFn: fetchCurrentMonthEvents,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
  });
};
