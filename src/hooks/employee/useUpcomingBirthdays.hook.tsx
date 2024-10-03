import { useQuery } from '@tanstack/react-query';

import { fetchUpcomingBirthdays } from '@/services/employee/dashboard.service';

export const useUpcomingBirthdays = () => {
  return useQuery({
    queryKey: ['birthdays'],
    queryFn: fetchUpcomingBirthdays,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
  });
};
