import { AxiosResponse } from 'axios';

import { baseAPI } from '@/utils';

import { IAnnouncement } from '@/types/hr-announcement.types';

// Fetch all announcements with query parameters
const fetchAnnouncements = async () => {
  const response: AxiosResponse<IAnnouncement[]> =
    await baseAPI.get('/announcements');
  console.log('response from service', response);
  return response;
};

// Fetch a single announcement by ID
const fetchAnnouncementById = async (id: string): Promise<IAnnouncement> => {
  const response: AxiosResponse<IAnnouncement> = await baseAPI.get(
    `/announcements/${id}`,
  );
  return response.data;
};

// Add a new announcement
const addAnnouncement = async (
  values: IAnnouncement,
): Promise<IAnnouncement> => {
  const response: AxiosResponse<IAnnouncement> = await baseAPI.post(
    '/announcements',
    values,
  );
  return response.data;
};

// Update an existing announcement by ID
const updateAnnouncement = async (
  id: string,
  values: Partial<IAnnouncement>,
): Promise<IAnnouncement> => {
  const response: AxiosResponse<IAnnouncement> = await baseAPI.put(
    `/announcements/${id}`,
    values,
  );
  return response.data;
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
}): Promise<IAnnouncement[]> => {
  const response: AxiosResponse<IAnnouncement[]> = await baseAPI.get(
    '/announcement/search',
    { params },
  );
  return response.data;
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
