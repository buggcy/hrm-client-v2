import { AxiosResponse } from 'axios';

import {
  PerkApiResponse,
  perkApiResponseSchema,
} from '@/libs/validations/perk';
import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from '../hr/employee.service';

export interface PerkListParams {
  page?: number;
  limit?: number;
  name?: string;
  amount?: string;
  date?: string;
  status?: string;
}

export const getPerkList = async (
  params: PerkListParams = {},
  id: string,
): Promise<PerkApiResponse> => {
  const defaultParams: PerkListParams = {
    page: 1,
    limit: 5,
    name: '',
    amount: '',
    status: '',
    date: '',
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
      `/employee/${id}/perks?${queryParams.toString()}`,
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
}: {
  employeeId: string;
  perkId: string;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/employee/${employeeId}/perks/${perkId}/unavail`,
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
