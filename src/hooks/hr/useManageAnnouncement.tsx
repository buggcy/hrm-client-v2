import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import {
  AnnouncementApiResponse,
  PolicyQueryParamsType,
} from '@/libs/validations/hr-announcement';
import {
  addAnnouncement,
  deleteAllAnnouncements,
  deleteAnnouncement,
  fetchAnnouncementById,
  fetchAnnouncements,
  searchAnnouncements,
  updateAnnouncement,
} from '@/services/hr/announcement.service';

import { UseQueryConfig } from '@/types';
import { IAnnouncement } from '@/types/hr-announcement.types';

export const useAnnouncementsQuery = (params: PolicyQueryParamsType = {}) => {
  return useQuery<AnnouncementApiResponse, Error>({
    queryKey: ['announcements', params],
    queryFn: () => fetchAnnouncements(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useAnnouncementQuery = (
  id: string,
  config: UseQueryConfig = {},
) => {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: () => fetchAnnouncementById(id),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<IAnnouncement, Error>;
};

// Hook to add a new announcement
export const useAddAnnouncementMutation = () => {
  return useMutation({
    mutationFn: addAnnouncement,
  }) as UseMutationResult<IAnnouncement, Error, IAnnouncement>;
};

export const useUpdateAnnouncementMutation = () => {
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Partial<IAnnouncement>;
    }) => updateAnnouncement(id, values),
  }) as UseMutationResult<
    IAnnouncement,
    Error,
    { id: string; values: Partial<IAnnouncement> }
  >;
};

export const useDeleteAnnouncementMutation = () => {
  return useMutation({
    mutationFn: deleteAnnouncement,
  }) as UseMutationResult<void, Error, string>;
};

export const useDeleteAllAnnouncementsMutation = () => {
  return useMutation({
    mutationFn: deleteAllAnnouncements,
  }) as UseMutationResult<void, Error, string[]>;
};

export const useSearchAnnouncementsQuery = (
  params: {
    page: number;
    limit: number;
    query: string;
    priority?: string[];
    status?: string[];
  },
  config: UseQueryConfig = {},
) => {
  return useQuery({
    queryKey: ['announcement-search', params],
    queryFn: () => searchAnnouncements(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<IAnnouncement[], Error>;
};
