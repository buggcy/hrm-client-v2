import { useQuery } from '@tanstack/react-query';

import {
  fetchCurrentMonthEvents,
  fetchWeeklyEvents,
} from '@/services/employee/dashboard.service';

import { EventData } from '@/types/events.types';

export const useEventsData = () => {
  return useQuery<EventData[], Error>({
    queryKey: ['events'],
    queryFn: fetchCurrentMonthEvents,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
  });
};
export const useWeeklyEvents = () => {
  return useQuery<EventData[], Error>({
    queryKey: ['weeklyEvents'],
    queryFn: fetchWeeklyEvents,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
  });
};
