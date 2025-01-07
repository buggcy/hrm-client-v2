import { AxiosResponse } from 'axios';

import {
  PerkApiResponse,
  perkApiResponseSchema,
  PerkRecordApiResponse,
  perkRecordApiResponseSchema,
} from '@/libs/validations/perk';
import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from '../hr/employee.service';

export interface PerkListParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  status?: string[];
  query?: string;
}

export interface PerkRecordParams {
  from?: string;
  to?: string;
}

export const postPerkList = async (
  params: PerkListParams = {},
  id: string,
): Promise<PerkApiResponse> => {
  const defaultParams: PerkListParams = {
    page: 1,
    limit: 5,
    from: '',
    to: '',
    status: [],
    query: '',
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(
      `/v2/employee/${id}/perks`,
      mergedParams,
    );
    return schemaParse(perkApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching perks and benefits list:', error);
    throw error;
  }
};

export const PerkList = async (id: string): Promise<AxiosResponse> => {
  const res = await baseAPI.get(`/employee/${id}/allPerks`);
  return res;
};

export const unAvailPerk = async ({
  employeeId,
  perkId,
  applicationId,
}: {
  employeeId: string;
  perkId: string;
  applicationId: string;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/employee/${employeeId}/perks/${perkId}/application/${applicationId}/unavail`,
  );
  return { message };
};

export const AvailPerk = async ({
  employeeId,
  perkId,
  formData,
}: {
  employeeId: string;
  perkId: string;
  formData: FormData;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/employee/${employeeId}/perks/${perkId}/avail`,
    formData,
  );
  return { message };
};

export const updateAvailPerk = async ({
  employeeId,
  perkId,
  applicationId,
  formData,
}: {
  employeeId: string;
  perkId: string;
  applicationId: string;
  formData: FormData;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/employee/${employeeId}/perks/${perkId}/applicationId/${applicationId}/updateAvail`,
    formData,
  );
  return { message };
};

export const searchPerkList = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<PerkApiResponse> => {
  const { data, pagination }: PerkApiResponse = await baseAPI.get(
    `/search/perks?page=${page}&limit=${limit}&query=${query}`,
  );

  return { data, pagination };
};

export const getPerkRecords = async (
  params: PerkRecordParams = {},
  id: string,
): Promise<PerkRecordApiResponse> => {
  const defaultParams: PerkRecordParams = {
    from: '',
    to: '',
  };

  const mergedParams = { ...defaultParams, ...params };

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
      `/records/${id}/perks?${queryParams.toString()}`,
    );
    return schemaParse(perkRecordApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching perks and benefits records:', error);
    throw error;
  }
};
