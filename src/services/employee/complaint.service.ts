import {
  complaintApiResponseSchema,
  ComplaintListApiResponse,
  ComplaintTrendChartApiResponse,
  complaintTrendChartApiResponseSchema,
} from '@/libs/validations/complaint';
import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from '../hr/employee.service';

export interface ComplaintParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  userId?: string;
  status?: string[];
}

export interface PendingComaplaintParams {
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
export interface ComplaintBody {
  proofDocument?: string;
  userId?: string;
  complaint: string;
  title: string;
}
export interface ResolvedComplaintBody {
  hrId: string;
  message: string;
}
export interface ComaplaintRecordParams {
  from?: string;
  to?: string;
}
export const getComplaints = async (
  params: ComplaintParams = {},
): Promise<ComplaintListApiResponse> => {
  const defaultParams: ComplaintParams = {
    page: 1,
    limit: 5,
    from: '',
    to: '',
    userId: '',
    status: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/read/complaints`, mergedParams);
    return schemaParse(complaintApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching complaint list:', error);
    throw error;
  }
};

export const getPendingComplaints = async (
  params: PendingComaplaintParams = {},
): Promise<ComplaintListApiResponse> => {
  const defaultParams: PendingComaplaintParams = {
    from: '',
    to: '',
    page: 1,
    limit: 5,
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
      `/get/pending/complaints?${queryParams.toString()}`,
    );
    return schemaParse(complaintApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching pending complaints!', error);
    throw error;
  }
};

export const searchComplaints = async ({
  query,
  page,
  limit,
  userId,
}: {
  query: string;
  page: number;
  limit: number;
  userId?: string;
}): Promise<ComplaintListApiResponse> => {
  const { data, pagination }: ComplaintListApiResponse = await baseAPI.get(
    `/search/complaints?page=${page}&limit=${limit}&query=${query}&userId=${userId}`,
  );

  return { data, pagination };
};

export const deleteComplaint = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/delete/complaint/${id}`,
  );
  return { message };
};

export const cancelComplaint = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/cancel/complaint/${id}`,
  );
  return { message };
};

export const registerComplaint = async (
  formData: FormData,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/complaint/register`,
    formData,
  );
  return { message };
};

export const updateComplaint = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/edit/complaint/${id}`,
    formData,
  );
  return { message };
};

export const resolvedComplaint = async ({
  id,
  employeeId,
  body,
}: {
  id: string;
  employeeId: string;
  body: ResolvedComplaintBody;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/resolved/${employeeId}/complaint/${id}`,
    body,
  );
  return { message };
};

export const getComplaintRecords = async (
  params: ComaplaintRecordParams = {},
): Promise<ComplaintTrendChartApiResponse> => {
  const defaultParams: ComaplaintRecordParams = {
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
      `/chart/complaint/data?${queryParams.toString()}`,
    );
    return schemaParse(complaintTrendChartApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching complaint list records:', error);
    throw error;
  }
};
