import { AddAttendanceFormData } from '@/app/(portal)/(hr)/hr/manage-attendance/attendance-list/components/AttendanceDialog';
import {
  attendanceListApiResponseSchema,
  AttendanceListStatsApiResponseSchema,
  attendanceUsersApiResponseSchema,
  userDateAttendanceSchema,
} from '@/libs/validations/attendance-list';
import { baseAPI, schemaParse } from '@/utils';

import {
  AttendanceListApiResponse,
  AttendanceListStatsApiResponse,
  AttendanceUsers,
  UserDateAttendance,
} from '@/types/attendance-list.types';

export interface AttendanceListParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  date?: string;
  Status?: string;
  Total_Time?: string;
  Productivity?: string;
  breaks?: string;
  fullname?: string;
  Start_Time?: string;
}

export type SuccessMessageResponse = {
  message: string;
};

export const addAttendaceData = async ({
  employee,
  inTime,
  outTime,
  totalTime,
  Status,
  date,
}: AddAttendanceFormData): Promise<SuccessMessageResponse> => {
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/attendence-v2`,
    {
      User_ID: employee,
      Start_Date: inTime,
      End_Date: outTime,
      Total_Time: totalTime,
      Status,
      date: formattedDate,
    },
  );
  return { message };
};

export const getEmployeeList = async (): Promise<AttendanceUsers> => {
  const res = await baseAPI.get(`/attendance-users`);
  return schemaParse(attendanceUsersApiResponseSchema)(res);
};

export const getDateAttendance = async ({
  date,
  id,
}: {
  date: string;
  id: string;
}): Promise<UserDateAttendance> => {
  const res = await baseAPI.get(
    `/attendence-user-date-v2?User_ID=${id}&date=${date}`,
  );
  return schemaParse(userDateAttendanceSchema)(res);
};

export const searchAttedanceList = async ({
  page,
  limit,
  query,
  from = new Date(),
  to = new Date(),
}: {
  page: number;
  limit: number;
  query: string;
  from?: Date;
  to?: Date;
}): Promise<AttendanceListApiResponse> => {
  const res = await baseAPI.get(
    `/attendence-v2?page=${page}&limit=${limit}&fullname=${query}&from=${from?.toISOString()}&to=${to?.toISOString()}`,
  );
  return schemaParse(attendanceListApiResponseSchema)(res);
};

export const getAttendanceList = async (
  params: AttendanceListParams = {},
): Promise<AttendanceListApiResponse> => {
  const defaultParams: AttendanceListParams = {
    page: 1,
    limit: 5,
    from: '',
    to: '',
    date: '',
    Status: '',
    Total_Time: '',
    Productivity: '',
    breaks: '',
    fullname: '',
    Start_Time: '',
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
      `/attendence-v2?${queryParams.toString()}`,
    );
    return schemaParse(attendanceListApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const getAttendanceListStats = async ({
  from = '',
  to = '',
}: {
  from?: string;
  to?: string;
}): Promise<AttendanceListStatsApiResponse> => {
  const res = await baseAPI.get(
    `/attendence-overview-v2?from=${from}&to=${to}`,
  );
  return schemaParse(AttendanceListStatsApiResponseSchema)(res);
};

export const deleteAttendance = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const Ids = [id];
  const { message }: SuccessMessageResponse = await baseAPI.patch(
    `/attendences/multiple-delete`,
    {
      Ids,
    },
  );
  return { message };
};
