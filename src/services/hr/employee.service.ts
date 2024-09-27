import { employeeApiResponseSchema } from '@/libs/validations/employee';
import { baseAPI, schemaParse } from '@/utils';

import { EmployeeApiResponse } from '@/types/employee.types';

export interface EmployeeListParams {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  gender?: string;
  dob?: string;
  contactNo?: string;
  designation?: string;
  companyEmail?: string;
}

export const getEmployeeList = async (
  params: EmployeeListParams = {},
): Promise<EmployeeApiResponse> => {
  const defaultParams: EmployeeListParams = {
    page: 1,
    limit: 5,
    name: '',
    email: '',
    gender: '',
    dob: '',
    contactNo: '',
    designation: '',
    companyEmail: '',
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
    const response = await baseAPI.get(`/employee?${queryParams.toString()}`);
    return schemaParse(employeeApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};
