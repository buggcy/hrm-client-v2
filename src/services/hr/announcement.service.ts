import { AddAnnouncementFormData } from '@/app/(portal)/(hr)/hr/manage-announcement/components/AnnouncementDialog';
import {
  AnnouncementApiResponse,
  announcementApiResponseSchema,
  AnnouncementType,
  PolicyQueryParamsType,
} from '@/libs/validations/hr-announcement';
import { baseAPI } from '@/utils';

type SuccessMessageResponse = {
  message: string;
};

const fetchAnnouncements = async (
  params?: PolicyQueryParamsType,
): Promise<AnnouncementApiResponse> => {
  const response: AnnouncementApiResponse = await baseAPI.get(
    '/announcements',
    {
      params: params || {},
    },
  );
  return announcementApiResponseSchema.parse(response);
};

const fetchAnnouncementById = async (
  _id: string,
): Promise<AnnouncementType> => {
  const response: AnnouncementType = await baseAPI.get(`/announcements/${_id}`);
  console.log('get by id', response);
  return response;
};

const addAnnouncement = async (
  data: AddAnnouncementFormData,
): Promise<SuccessMessageResponse> => {
  console.log('data in service', data);
  const { message }: SuccessMessageResponse = await baseAPI.post(
    '/announcements',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return { message };
};

const updateAnnouncement = async (
  _id: string,
  values: Partial<AddAnnouncementFormData>,
): Promise<SuccessMessageResponse> => {
  await baseAPI.put(`/announcements/${_id}`, values);
  console.log(`Announcement with ID ${_id} updated successfully.`);
  return {
    message: 'Announcement updated successfully!',
  };
};

const deleteAnnouncement = async (
  _id: string,
): Promise<SuccessMessageResponse> => {
  console.log('front end sercie', _id);
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/announcements/${_id}`,
  );
  return { message };
};

const deleteAllAnnouncements = async (ids: string[]): Promise<void> => {
  await baseAPI.patch('/announcement/multiple-delete', { ids });
};

const searchAnnouncements = async (params: {
  page: number;
  limit: number;
  query: string;
  priority?: string;
  isEnabled?: string;
}): Promise<AnnouncementApiResponse> => {
  const response: AnnouncementApiResponse = await baseAPI.get(
    '/announcement/search',
    {
      params: {
        page: params.page,
        limit: params.limit,
        query: params.query,
        ...(params.priority && { priority: params.priority }),
        ...(params.isEnabled && { isEnabled: params.isEnabled }),
      },
    },
  );
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
