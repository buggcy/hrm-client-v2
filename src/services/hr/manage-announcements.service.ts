import { AddAnnouncementFormData } from '@/app/(portal)/(hr)/hr/manage-announcements/components/AddAnnouncementDialog.component';
import {
  ManageAnnouncementsApiResponse,
  ManageAnnouncementsApiResponseSchema,
  ManageAnnouncementsStatsApiResponse,
  ManageAnnouncementsStatsApiResponseSchema,
} from '@/libs/validations/hr-announcements';
import { baseAPI, schemaParse } from '@/utils';

export interface ManageAnnouncementParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  isEnabled?: string[];
  title?: string;
  Description?: string;
  StartDate?: string;
  EndDate?: string;
  Priority?: string[];
}

export const getAnnouncementStats = async ({
  from = '',
  to = '',
}: {
  from?: string;
  to?: string;
}): Promise<ManageAnnouncementsStatsApiResponse> => {
  const res = await baseAPI.get(`/announcements-stats?from=${from}&to=${to}`);
  return schemaParse(ManageAnnouncementsStatsApiResponseSchema)(res);
};

export const getAnnouncements = async (
  params: ManageAnnouncementParams = {},
): Promise<ManageAnnouncementsApiResponse> => {
  const defaultParams: ManageAnnouncementParams = {
    page: 1,
    limit: 5,
    from: '',
    to: '',
    isEnabled: [],
    title: '',
    Description: '',
    Priority: [],
  };

  const mergedParams = {
    ...defaultParams,
    ...params,
  };

  const queryParams = new URLSearchParams(
    Object.entries(mergedParams).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value.toString();
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  try {
    const response = await baseAPI.get(
      `/announcements?${queryParams.toString()}`,
    );
    return schemaParse(ManageAnnouncementsApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const searchAnnouncements = async ({
  from = '',
  to = '',
  page = 1,
  limit = 5,
  query = '',
  Priority = [],
}: {
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  query?: string;
  Priority?: string[];
}): Promise<ManageAnnouncementsApiResponse> => {
  const res = await baseAPI.get(
    `/announcement/search?from=${from}&to=${to}&page=${page}&limit=${limit}&query=${query}&Priority=${Priority.join(',')}`,
  );
  return schemaParse(ManageAnnouncementsApiResponseSchema)(res);
};

export const exportAnnouncementCSVData = async (
  ids: Array<string>,
): Promise<BlobPart> => {
  const res: BlobPart = await baseAPI.post(`/announcement/export-csv`, { ids });
  return res;
};

export type SuccessMessageResponse = {
  message: string;
};

export const deleteAnnouncement = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/announcements/${id}`,
  );
  return { message };
};

export const addAnnouncement = async ({
  StartDate,
  EndDate,
  Priority,
  isEnabled,
  title,
  Description,
  hrId,
}: AddAnnouncementFormData): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/announcements`,
    {
      StartDate,
      EndDate,
      Priority,
      isEnabled,
      title,
      Description,
      hrId,
      TargetAudience: 'AllEmployees',
    },
  );
  return { message };
};

export const updateAnnouncement = async ({
  id,
  data,
}: {
  id: string;
  data: AddAnnouncementFormData;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/announcements/${id}`,
    {
      StartDate: data.StartDate,
      EndDate: data.EndDate,
      Priority: data.Priority,
      isEnabled: data.isEnabled,
      title: data.title,
      Description: data.Description,
      TargetAudience: 'AllEmployees',
    },
  );
  return { message };
};
