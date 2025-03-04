import { AxiosResponse } from 'axios';

import { ApprovalEmployeeType } from '@/app/(portal)/(hr)/hr/approval/ApprovalCard/ApprovalCard';
import { AddEmployeeFormData } from '@/app/(portal)/(hr)/hr/manage-employees/components/EmployeeModal';
import {
  cardDataSchema,
  EmployeeApiResponse,
  employeeApiResponseSchema,
  employeeDobDataSchema,
  employeeFiredResignedApiResponseSchema,
  EmployeeListType,
  pendingResignedApiResponseSchema,
  PendingResignedListApiResponse,
  resignedApiResponseSchema,
  ResignedListApiResponse,
} from '@/libs/validations/employee';
import { baseAPI, schemaParse } from '@/utils';

export interface EmployeeListParams {
  page?: number;
  limit?: number;
  gender?: string[];
  isApproved?: string[];
}

export interface EditProfileResponse {
  message: string;
  token: string;
}
export type SuccessMessageResponse = {
  message: string;
};
export interface FireBody {
  employeeId: string;
  hrId: string;
  title: string;
  reason: string;
  description: string;
  appliedDate?: string;
  immedaiteDate?: string;
  isFired: boolean;
  type?: string;
}

export interface ApprovedRejectResignationBody {
  hrId: string;
  isApproved: string;
}

export interface ApprovedRejectResignationParams {
  id: string;
  employeeId: string;
  body: ApprovedRejectResignationBody;
}

export interface ResignedParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  status?: string[];
}

export interface GetResignedParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}

export const getEmployeeList = async (
  params: EmployeeListParams = {},
): Promise<EmployeeApiResponse> => {
  const defaultParams: EmployeeListParams = {
    page: 1,
    limit: 5,
    gender: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/v2/employee`, mergedParams);
    return schemaParse(employeeApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const getUnapprovedEmployeeList = async (
  params: EmployeeListParams = {},
): Promise<EmployeeApiResponse> => {
  const defaultParams: EmployeeListParams = {
    page: 1,
    limit: 5,
    isApproved: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(
      `/v2/employee/unapproved`,
      mergedParams,
    );
    return schemaParse(employeeApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const searchEmployeeList = async ({
  query,
  page,
  limit,
  gender,
}: {
  query: string;
  page: number;
  limit: number;
  gender: string[];
}): Promise<EmployeeApiResponse> => {
  const { data, pagination }: EmployeeApiResponse = await baseAPI.post(
    `/v2/employee/search`,
    { query, page, limit, gender },
  );

  return { data, pagination };
};

export const unapprovedSearchEmployeeList = async ({
  query,
  page,
  limit,
  isApproved,
}: {
  query: string;
  page: number;
  limit: number;
  isApproved: string[];
}): Promise<EmployeeApiResponse> => {
  const { data, pagination }: EmployeeApiResponse = await baseAPI.post(
    `/v2/employee/unapproved/search`,
    { query, page, limit, isApproved },
  );

  return { data, pagination };
};

export const approvalEmployeeList = async (): Promise<
  AxiosResponse<EmployeeListType[]>
> => {
  const res = await baseAPI.get(`/user/unapproved`);
  return res;
};

export const addEmployeeData = async ({
  data,
}: {
  data: AddEmployeeFormData;
  id: string;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(`/employee`, {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email.toLowerCase(),
    companyEmail: data.companyEmail.toLowerCase(),
    contactNo: data.contactNo,
    basicSalary: data.basicSalary,
    desiredSalary: data.desiredSalary,
    Joining_Date: data.Joining_Date,
    Designation: data.Designation,
    dep_ID: data.dep_ID,
  });
  return { message };
};

export const updateTBAEmployeeData = async ({
  data,
  id,
}: {
  data: AddEmployeeFormData;
  id: string;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/employee/${id}`,
    {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      companyEmail: data.companyEmail.toLowerCase(),
      contactNo: data.contactNo,
      basicSalary: data.basicSalary,
      desiredSalary: data.desiredSalary,
      Joining_Date: data.Joining_Date,
      Designation: data.Designation,
      dep_ID: data.dep_ID,
    },
  );
  return { message };
};

export const resendEmployeeInvitation = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/employee/resendcode/${id}`,
  );
  return { message };
};

export const exportEmployeeCSVData = async (ids: Array<string>) => {
  const res = await baseAPI.post(`/user/export-csv`, { ids });
  return res;
};

export const deleteEmployeeRecord = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/employee/${id}`,
  );

  return { message };
};

export const employeeApprovalRequest = async (
  data: ApprovalEmployeeType,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/approve-employee`,
    data,
  );
  return { message };
};

export const ReadEmployeeRecord = async (
  id: string,
): Promise<AxiosResponse> => {
  const res = await baseAPI.get(`/employee/${id}`);
  return res;
};

export const ChangePassword = async ({
  id,
  oldPassword,
  newPassword,
}: {
  id: string;
  oldPassword: string;
  newPassword: string;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/change-password/${id}`,
    {
      oldPassword,
      newPassword,
    },
  );
  return { message };
};

export const EditProfile = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<EditProfileResponse> => {
  const { message, token }: EditProfileResponse = await baseAPI.put(
    `/employee/edit/profile/${id}`,
    formData,
  );
  return { message, token };
};
export interface EmployeeChart {
  month: string;
  added: number;
  resigned: number;
  fired: number;
}
export interface CardData {
  Card2Data: {
    pending: number;
    tba: number;
    rejected: number;
    approved: number;
    internees: number;
  };
  Card3Data: {
    tba: {
      expired: number;
      pending: number;
    };
    Rejected: {
      expired: number;
      pending: number;
    };
  };
  employeeChart: EmployeeChart[];
}

export interface DobData {
  _id: string;
  firstName: string;
  lastName: string;
  DOB?: string;
  Joining_Date?: string;
  remainingDays: number;
}
export const getAddEmployeeCharts = async (): Promise<CardData> => {
  try {
    const response = await baseAPI.get('/addEmployee/charts');
    return schemaParse(cardDataSchema)(response);
  } catch (error) {
    console.error('Error fetching add employee charts:', error);
    throw error;
  }
};

export const resignedFiredSearchEmployeeList = async ({
  query,
  page,
  limit,
  isApproved,
}: {
  query: string;
  page: number;
  limit: number;
  isApproved: string[];
}): Promise<EmployeeApiResponse> => {
  const { data, pagination }: EmployeeApiResponse = await baseAPI.post(
    `/search/all/resigned-fired/employees`,
    { query, page, limit, isApproved },
  );

  return { data, pagination };
};

export const getPendingResignedRequest = async (
  params: GetResignedParams = {},
): Promise<PendingResignedListApiResponse> => {
  const defaultParams: GetResignedParams = {
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
      `/get/resignation/approvals?${queryParams.toString()}`,
    );
    return schemaParse(pendingResignedApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching Pending resigned requests!', error);
    throw error;
  }
};

export const ApprovedRejectResignation = async ({
  id,
  employeeId,
  body,
}: ApprovedRejectResignationParams): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/resignation/${id}/approved/${employeeId}`,
    body,
  );
  return { message };
};

export const ResignationRecordById = async (
  id: string,
): Promise<AxiosResponse> => {
  const res = await baseAPI.get(`/resignation/${id}`);
  return res;
};
export const getEmpDobDate = async (): Promise<DobData[]> => {
  try {
    const response = await baseAPI.get('/employee/dob', {
      params: { fetchAll: true },
    });
    return employeeDobDataSchema.parse(response);
  } catch (error) {
    console.error(`Error fetching Employee's Date of Birth data:`, error);
    throw error;
  }
};

export const FireEmployee = async ({
  body,
}: {
  body: FireBody;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/fire/employee`,
    body,
  );
  return { message };
};

export const resignedEmployee = async (
  params: ResignedParams = {},
): Promise<ResignedListApiResponse> => {
  const defaultParams: ResignedParams = {
    page: 1,
    limit: 5,
    from: '',
    to: '',
    status: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/read/all/resignations`, mergedParams);
    return schemaParse(resignedApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching resigned records:', error);
    throw error;
  }
};
export const searchResignedEmployee = async ({
  query,
  page,
  limit,
  from,
  to,
}: {
  query: string;
  page: number;
  limit: number;
  from?: string;
  to?: string;
}): Promise<ResignedListApiResponse> => {
  const { data, pagination }: ResignedListApiResponse = await baseAPI.get(
    `/resignations/search?page=${page}&limit=${limit}&query=${query}&from=${from}&to=${to}`,
  );

  return { data, pagination };
};

export const getResignedFiredEmployeeList = async (
  params: EmployeeListParams = {},
): Promise<EmployeeApiResponse> => {
  const defaultParams: EmployeeListParams = {
    page: 1,
    limit: 5,
    isApproved: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(
      `/all/resigned-fired/employees`,
      mergedParams,
    );
    return schemaParse(employeeFiredResignedApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const DeleteResignation = async ({
  id,
}: {
  id: string;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/delete/resignation/${id}`,
  );
  return { message };
};
