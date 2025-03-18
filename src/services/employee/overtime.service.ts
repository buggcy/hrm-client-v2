import {
  overtimeApiResponseSchema,
  OvertimeChartApiResponse,
  overtimeChartApiResponseSchema,
  OvertimeListApiResponse,
  overtimeRequestApiResponseSchema,
  OvertimeRequestListApiResponse,
} from '@/libs/validations/overtime';
import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from '../hr/employee.service';

export interface RequestBodyParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  userId?: string;
  status?: string[];
}
export interface RequestParams {
  from?: string;
  to?: string;
}
interface BodyParams {
  date?: string;
  minutes?: number;
  reason?: string;
  status?: string;
  userId?: string;
}
interface ApprovalParams {
  hrId?: string;
  rejectionReason?: string;
  status: string;
  userId?: string;
}

export const getOvertime = async (
  params: RequestBodyParams = {},
): Promise<OvertimeListApiResponse> => {
  const defaultParams: RequestBodyParams = {
    page: 1,
    limit: 5,
    from: '',
    to: '',
    userId: '',
    status: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/read/overtimes`, mergedParams);
    return schemaParse(overtimeApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching overtime list:', error);
    throw error;
  }
};

export const searchOvertime = async ({
  query,
  page,
  limit,
  userId,
  from,
  to,
}: {
  query: string;
  page: number;
  limit: number;
  userId?: string;
  from?: string;
  to?: string;
}): Promise<OvertimeListApiResponse> => {
  const { data, pagination }: OvertimeListApiResponse = await baseAPI.get(
    `/search/overtimes?page=${page}&limit=${limit}&query=${query}&userId=${userId}&from=${from}&to=${to}`,
  );

  return { data, pagination };
};

export const updateOvertime = async ({
  id,
  body,
}: {
  id: string;
  body: BodyParams;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/overtime/${id}`,
    body,
  );
  return { message };
};

export const applyOvertime = async ({
  body,
}: {
  body: BodyParams;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/overtime/apply`,
    body,
  );
  return { message };
};

export const getOvertimeRequest = async (
  params: RequestParams = {},
): Promise<OvertimeRequestListApiResponse> => {
  const defaultParams: RequestParams = {
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

  try {
    const response = await baseAPI.get(
      `/overtime/requests?${queryParams.toString()}`,
    );
    return schemaParse(overtimeRequestApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching overtime requests:', error);
    throw error;
  }
};

export const AcceptRejectOvertime = async ({
  id,
  body,
}: {
  id: string;
  body: ApprovalParams;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/approval/overtime/${id}`,
    body,
  );
  return { message };
};

export const getOvertimeRecord = async (
  params: {
    from?: string;
    to?: string;
    userId?: string;
  } = {},
): Promise<OvertimeChartApiResponse> => {
  const defaultParams: {
    from?: string;
    to?: string;
    userId?: string;
  } = {
    from: '',
    to: '',
    userId: '',
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
      `/overtime/statistics?${queryParams.toString()}`,
    );
    return schemaParse(overtimeChartApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching overtime requests chart records:', error);
    throw error;
  }
};
