import { AddPerkFormData } from '@/app/(portal)/(hr)/hr/manage-perks/add-perks/components/AddPerksDialog';
import {
  HrEmployeeAllPerksApiResponseSchema,
  HrPerksGetEmployeesApiResponseSchema,
  hrPerksListApiResponseSchema,
} from '@/libs/validations/hr-perks';
import { baseAPI, schemaParse } from '@/utils';

import {
  HrEmployeeAllPerks,
  HrEmployeeAllPerksApiResponse,
  HrPerksGetEmployeesApiResponse,
  HrPerksListApiResponse,
} from '@/types/hr-perks-list.types';

export interface HrPerksListParams {
  page?: number;
  limit?: number;
  type?: string[];
}

export const getHrPerksList = async (
  params: HrPerksListParams = {},
): Promise<HrPerksListApiResponse> => {
  const defaultParams: HrPerksListParams = {
    page: 1,
    limit: 5,
    type: [''],
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
    const response = await baseAPI.get(`/perks?${queryParams.toString()}`);
    return schemaParse(hrPerksListApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const searchHrPerkList = async ({
  page,
  limit,
  query,
  type,
}: {
  page: number;
  limit: number;
  query: string;
  type?: string[];
}): Promise<HrPerksListApiResponse> => {
  const res = await baseAPI.get(
    `/perks?page=${page}&limit=${limit}&name=${query}&type=${type ? type.join(',') : ''}`,
  );
  return schemaParse(hrPerksListApiResponseSchema)(res);
};

type SuccessMessageResponse = {
  message: string;
};

export const addPerk = async ({
  name,
  description,
  salaryIncrement,
  salaryDecrement,
}: AddPerkFormData): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(`/perks`, {
    name,
    description,
    salaryIncrement,
    salaryDecrement,
  });
  return { message };
};

export const updatePerk = async ({
  id,
  name,
  description,
  salaryIncrement,
  salaryDecrement,
}: {
  id: string;
  name: string;
  description: string;
  salaryIncrement: boolean;
  salaryDecrement: boolean;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/perks/${id}`,
    {
      name,
      description,
      salaryIncrement,
      salaryDecrement,
    },
  );
  return { message };
};

export const deletePerk = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/delete-perk/${id}`,
  );
  return { message };
};

export const fetchEmployeesForPerks =
  async (): Promise<HrPerksGetEmployeesApiResponse> => {
    const res = await baseAPI.get('/employee/perks');
    return schemaParse(HrPerksGetEmployeesApiResponseSchema)(res);
  };

export const fetchEmployeesAllPerks = async ({
  id,
}: {
  id: string;
}): Promise<HrEmployeeAllPerksApiResponse> => {
  const res = await baseAPI.get(`/employee/${id}/allPerks`);
  return schemaParse(HrEmployeeAllPerksApiResponseSchema)(res);
};

export const perksHandler = async ({
  id,
  data,
}: {
  id: string;
  data?: HrEmployeeAllPerks[];
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/employee/${id}/perksHandle`,
    { perks: data },
  );
  return { message };
};
