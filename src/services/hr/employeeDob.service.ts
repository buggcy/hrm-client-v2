import { employeeDobApiResponseSchema } from '@/libs/validations/employee';
import { baseAPI, schemaParse } from '@/utils';

import { EmployeeDobTableApiResponse } from '@/types/employeeDobPayroll.types';

export interface EmpDobTableParams {
  page?: number;
  limit?: number;
  firstName: string;
  lastName: string;
  DOB?: Date;
  remainingDays: number;
}

export const getEmpDobTableList = async (
  params: EmpDobTableParams = {
    firstName: '',
    lastName: '',
    DOB: undefined,
    remainingDays: 0,
  },
): Promise<EmployeeDobTableApiResponse> => {
  const defaultParams: EmpDobTableParams = {
    page: 1,
    limit: 5,
    firstName: '',
    lastName: '',
    DOB: undefined,
    remainingDays: 0,
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
      `/employee/dob?${queryParams.toString()}`,
    );

    return schemaParse(employeeDobApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee Date of Birth:', error);
    throw error;
  }
};

export const searchEmployeeDobTableList = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<EmployeeDobTableApiResponse> => {
  const res = await baseAPI.get(
    `/employee/dob?page=${page}&limit=${limit}&query=${query}`,
  );
  return schemaParse(employeeDobApiResponseSchema)(res);
};

// export const exportEmployeePayrollCSVData = async (
//   ids: Array<string>,
// ): Promise<BlobPart> => {
//   const res: BlobPart = await baseAPI.post(`/payroll/export-csv`, { ids });
//   return res;
// };

// export const deleteEmployeePayrollRecord = async (
//   id: string,
// ): Promise<AxiosResponse> => {
//   const res = await baseAPI.delete(`/employee/${id}`);
//   return res;
// };
