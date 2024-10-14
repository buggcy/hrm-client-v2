import {
  AnnouncementApiResponse,
  announcementApiResponseSchema,
  PolicyQueryParamsType,
} from '@/libs/validations/hr-announcement';
import { baseAPI } from '@/utils';

import { IAnnouncement } from '@/types/hr-announcement.types';

const fetchAnnouncements = async (
  params?: PolicyQueryParamsType,
): Promise<AnnouncementApiResponse> => {
  const response: AnnouncementApiResponse = await baseAPI.get(
    '/announcements',
    {
      params: params || {},
    },
  );
  console.log(
    'fetchAnnouncements response:',
    announcementApiResponseSchema.parse(response),
  );
  return announcementApiResponseSchema.parse(response);
};

// Fetch a single announcement by ID
const fetchAnnouncementById = async (id: string): Promise<IAnnouncement> => {
  const response: IAnnouncement = await baseAPI.get(`/announcements/${id}`);
  console.log('fetchAnnouncementById response:', response);

  return response;
};

// Add a new announcement
const addAnnouncement = async (
  values: IAnnouncement,
): Promise<IAnnouncement> => {
  const response: IAnnouncement = await baseAPI.post('/announcements', values);
  console.log('Fetched announcement response:', response);

  return response;
};

// Update an existing announcement by ID
const updateAnnouncement = async (
  id: string,
  values: Partial<IAnnouncement>,
): Promise<IAnnouncement> => {
  const response: IAnnouncement = await baseAPI.put(
    `/announcements/${id}`,
    values,
  );
  console.log('updateAnnouncement response:', response);

  return response;
};

// Delete an announcement by ID
const deleteAnnouncement = async (id: string): Promise<void> => {
  await baseAPI.delete(`/announcements/${id}`);
};

// Delete multiple announcements by IDs
const deleteAllAnnouncements = async (ids: string[]): Promise<void> => {
  await baseAPI.patch('/announcement/multiple-delete', { ids });
};

// Search announcements by query
const searchAnnouncements = async (params: {
  page: number;
  limit: number;
  query: string;
  priority?: string[];
  isEnabled?: string[];
}): Promise<AnnouncementApiResponse> => {
  const response: AnnouncementApiResponse = await baseAPI.get(
    '/announcement/search',
    {
      params: {
        ...params,
        ...(params.priority && { priority: params.priority }),
        ...(params.isEnabled && { status: params.isEnabled }),
      },
    },
  );
  console.log('searchAnnouncements response:', response.data);

  return response;
};

export {
  fetchAnnouncements,
  fetchAnnouncementById,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  deleteAllAnnouncements,
  searchAnnouncements,
};
