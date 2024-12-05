import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  ComaplaintRecordParams,
  ComplaintParams,
  getComplaintRecords,
  getComplaints,
  getPendingComplaints,
  PendingComaplaintParams,
} from '@/services/employee/complaint.service';

import { UseQueryConfig } from '@/types';
import {
  ComplaintApiResponse,
  ComplaintRecordApiResponse,
} from '@/types/complaint.types';

export const useComplaintQuery = (
  params: ComplaintParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['getComplaints', params],
    queryFn: () => getComplaints(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ComplaintApiResponse, Error>;

export const usePendingComplaintQuery = (
  params: PendingComaplaintParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['getPendingComplaints', params],
    queryFn: () => getPendingComplaints(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ComplaintApiResponse, Error>;

export const useComplaintRecordQuery = (
  params: ComaplaintRecordParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['complaintRecords', params],
    queryFn: () => getComplaintRecords(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ComplaintRecordApiResponse, Error>;
