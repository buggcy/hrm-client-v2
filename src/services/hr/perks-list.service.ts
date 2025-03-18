import { AddPerkFormData } from '@/app/(portal)/(hr)/hr/manage-perks/add-perks/components/AddPerksForm';
import {
  HrEmployeeAllPerksApiResponse,
  HrEmployeeAllPerksApiResponseSchema,
  HrPerkListApiResponse,
  hrperklistApiResponseSchema,
  HrPerkRecordApiResponse,
  hrPerkRecordApiResponseSchema,
  HrPerkRequestsApiResponseSchema,
  HrPerksGetEmployeesApiResponseSchema,
  hrPerksListApiResponseSchema,
} from '@/libs/validations/hr-perks';
import { baseAPI, schemaParse } from '@/utils';

import {
  HrEmployeeAllPerks,
  HrPerkRequestsApiResponse,
  HrPerksGetEmployeesApiResponse,
  HrPerksListApiResponse,
} from '@/types/hr-perks-list.types';

export interface HrPerksListParams {
  page?: number;
  limit?: number;
  type?: string[];
}

export interface HrPerkRequestsParams {
  from?: string;
  to?: string;
}

export interface HrPerkRequestsTableParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  status?: string[];
  query?: string;
}

export const getHrDataTablePerksRequest = async (
  params: HrPerkRequestsTableParams = {},
): Promise<HrPerkListApiResponse> => {
  const defaultParams: HrPerkRequestsTableParams = {
    page: 1,
    limit: 5,
    from: '',
    to: '',
    status: [],
    query: '',
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/v2/hr/perks`, mergedParams);
    return schemaParse(hrperklistApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching perks and benefits list:', error);
    throw error;
  }
};

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
    const response = await baseAPI.get(`/perks-v2?${queryParams.toString()}`);
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
    `/perks-v2?page=${page}&limit=${limit}&name=${query}&type=${type ? type.join(',') : ''}`,
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
  const { message }: SuccessMessageResponse = await baseAPI.post(`/perks-v2`, {
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
    `/perks-v2/${id}`,
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
    `/delete-perk-v2/${id}`,
  );
  return { message };
};

export const fetchEmployeesForPerks =
  async (): Promise<HrPerksGetEmployeesApiResponse> => {
    const res = await baseAPI.get('/employee/perks-v2');
    return schemaParse(HrPerksGetEmployeesApiResponseSchema)(res);
  };

export const fetchEmployeesAllPerks = async ({
  id,
}: {
  id: string;
}): Promise<HrEmployeeAllPerksApiResponse> => {
  const res = await baseAPI.get(`/employee/${id}/allPerks-v2`);
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

export const fetchPerkRequests = async (
  params: HrPerkRequestsParams = {},
): Promise<HrPerkRequestsApiResponse> => {
  const defaultParams: HrPerkRequestsParams = {
    from: '',
    to: '',
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
  const res = await baseAPI.get(
    `/hr/perk-requests-v2?${queryParams.toString()}`,
  );
  return schemaParse(HrPerkRequestsApiResponseSchema)(res);
};

export const approvePerkRequest = async ({
  id,
  employeeId,
  perkId,
}: {
  id: string;
  employeeId: string;
  perkId: string;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/hr/employee/${employeeId}/perks/${perkId}/perk-requests/${id}/approve`,
  );
  return { message };
};

export const rejectPerkRequest = async ({
  id,
  employeeId,
  perkId,
}: {
  id: string;
  employeeId: string;
  perkId: string;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `hr/employee/${employeeId}/perks/${perkId}/perk-requests/${id}/reject`,
  );
  return { message };
};

export const getPerkCardRecords =
  async (): Promise<HrPerkRecordApiResponse> => {
    try {
      const response = await baseAPI.get(`/hr/perks/record`);
      return schemaParse(hrPerkRecordApiResponseSchema)(response);
    } catch (error) {
      console.error('Error fetching perks cards records:', error);
      throw error;
    }
  };
