import { useQuery } from '@tanstack/react-query';

import {
  fetchCities,
  fetchCountries,
  fetchStates,
} from '@/services/country.service';

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  });
};

export const useStates = (countryCode: string) => {
  return useQuery({
    queryKey: ['states', countryCode],
    queryFn: () => fetchStates(countryCode),
    enabled: !!countryCode,
  });
};

export const useCities = (countryCode: string, stateCode: string) => {
  return useQuery({
    queryKey: ['cities', countryCode, stateCode],
    queryFn: () => fetchCities(countryCode, stateCode),
    enabled: !!stateCode,
  });
};
