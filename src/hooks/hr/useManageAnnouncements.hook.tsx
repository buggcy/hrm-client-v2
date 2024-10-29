import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { ManageAnnouncementsApiResponse } from '@/libs/validations/hr-announcements';
import {
  getAnnouncements,
  ManageAnnouncementParams,
} from '@/services/hr/manage-announcements.service';

import { UseQueryConfig } from '@/types';

export const useManageAnnouncementQuery = (
  params: ManageAnnouncementParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['manageAnnouncements', params],
    queryFn: () => getAnnouncements(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ManageAnnouncementsApiResponse, Error>;
