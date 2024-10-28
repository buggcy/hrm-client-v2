import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  CityApiResponse,
  CountryApiResponse,
  EmployeeDataApiResponse,
  SalaryType,
} from '@/libs/validations/edit-employee';
import {
  CitiesParams,
  EmployeeDetailsParams,
  getCitiesList,
  getCountryList,
  getEmployeeData,
  getEmployeeSalaryData,
  getStatesList,
  StatesParams,
} from '@/services/hr/edit-employee.service';

import { UseQueryConfig } from '@/types';

export const useEmployeeDataQuery = (
  params: EmployeeDetailsParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['editEmployeeData', params],
    queryFn: () => getEmployeeData(params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeeDataApiResponse, Error>;

export const useEmployeeSalaryQuery = (
  params: EmployeeDetailsParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['editEmployeeSalary', params],
    queryFn: () => getEmployeeSalaryData(params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<SalaryType, Error>;

export const useCountriesQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['editEmployeeCountries'],
    queryFn: () => getCountryList(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<CountryApiResponse, Error>;

export const useStatesQuery = (
  params: StatesParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['editEmployeeStates', params],
    queryFn: () => getStatesList(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<CountryApiResponse, Error>;

export const useCitiesQuery = (
  params: CitiesParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['editEmployeeCities', params],
    queryFn: () => getCitiesList(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<CityApiResponse, Error>;
