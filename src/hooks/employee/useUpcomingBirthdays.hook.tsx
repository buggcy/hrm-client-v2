import { useQuery } from '@tanstack/react-query';

import {
  fetchUpcomingBirthdays,
  fetchWeeklyBirthdays,
} from '@/services/employee/dashboard.service';

export const useUpcomingBirthdays = () => {
  return useQuery({
    queryKey: ['birthdays'],
    queryFn: fetchUpcomingBirthdays,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useWeeklyBirthdays = () => {
  return useQuery({
    queryKey: ['weeklyBirthdays'],
    queryFn: fetchWeeklyBirthdays,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
  });
};
