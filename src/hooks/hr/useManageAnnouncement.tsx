import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import {
  addAnnouncement,
  deleteAllAnnouncements,
  deleteAnnouncement,
  fetchAnnouncementById,
  fetchAnnouncements,
  searchAnnouncements,
  updateAnnouncement,
} from '@/services/hr/announcement.service'; // Adjust the import path according to your file structure

import { UseQueryConfig } from '@/types'; // Assuming you have these types defined
import {
  AnnouncementApiResponse,
  IAnnouncement,
} from '@/types/hr-announcement.types';

// Hook to fetch all announcements
export const useAnnouncementsQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['announcements'],
    queryFn: fetchAnnouncements,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<AnnouncementApiResponse, Error>;

// Hook to fetch a single announcement by ID
export const useAnnouncementQuery = (
  id: string,
  config: UseQueryConfig = {},
) => {
  return useQuery({
    queryKey: ['announcement', id], // Fixed the query key to be unique for each ID
    queryFn: () => fetchAnnouncementById(id), // Added the call to fetchAnnouncementById
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

// Hook to update an existing announcement
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

// Hook to delete an announcement
export const useDeleteAnnouncementMutation = () => {
  return useMutation({
    mutationFn: deleteAnnouncement,
  }) as UseMutationResult<void, Error, string>;
};

// Hook to delete multiple announcements
export const useDeleteAllAnnouncementsMutation = () => {
  return useMutation({
    mutationFn: deleteAllAnnouncements,
  }) as UseMutationResult<void, Error, string[]>;
};

// Hook to search announcements
export const useSearchAnnouncementsQuery = (
  params: { page: number; limit: number; query: string },
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
