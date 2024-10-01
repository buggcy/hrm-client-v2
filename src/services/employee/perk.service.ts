import { perkApiResponseSchema } from '@/libs/validations/perk';
import { baseAPI, schemaParse } from '@/utils';

import { PerkApiResponse } from '@/types/perk.types';

export interface PerkListParams {
  page?: number;
  limit?: number;
  name?: string;
  amount?: number;
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
    amount: 0,
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
