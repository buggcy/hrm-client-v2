import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { AddAnnouncementFormData } from '@/app/(portal)/(hr)/hr/manage-announcement/components/AnnouncementDialog';
import {
  AnnouncementApiResponse,
  AnnouncementType,
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
type SuccessMessageResponse = {
  message: string;
};

export const useAnnouncementsQuery = (params: PolicyQueryParamsType = {}) => {
  return useQuery<AnnouncementApiResponse, Error>({
    queryKey: ['announcements', params],
    queryFn: () => fetchAnnouncements(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useAnnouncementQuery = (id: string) => {
  return useQuery<AnnouncementType>({
    queryKey: ['announcement', id],
    queryFn: () => fetchAnnouncementById(id),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
  });
};

// Hook to add a new announcement
export const useAddAnnouncementMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessMessageResponse, Error, AddAnnouncementFormData>({
    mutationFn: addAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: error => {
      console.error('Error:', error);
    },
  });
};

export const useUpdateAnnouncementMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessMessageResponse,
    Error,
    { id: string; values: Partial<AddAnnouncementFormData> }
  >({
    mutationFn: ({ id, values }) => updateAnnouncement(id, values),
    onSuccess: data => {
      console.log('Announcement updated successfully:', data);
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: error => {
      console.error('Error updating announcement:', error);
    },
  }) as UseMutationResult<
    SuccessMessageResponse,
    Error,
    { id: string; values: Partial<AddAnnouncementFormData> }
  >;
};

export const useDeleteAnnouncementMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessMessageResponse, Error, string>({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
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
