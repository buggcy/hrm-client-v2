import axios from 'axios';

import { AddSalaryIncrementFormData } from '@/app/(portal)/(hr)/hr/manage-employees/edit-employee/components/salary-increment/components/SalaryIncrementDialog.component';
import {
  CityApiResponse,
  cityApiResponseSchema,
  CountryApiResponse,
  countryApiResponseSchema,
  EmployeeDataApiResponse,
  employeeDataApiResponseSchema,
  salarySchema,
  SalaryType,
} from '@/libs/validations/edit-employee';
import { baseAPI, schemaParse } from '@/utils';

const apiKey = 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==';
const apiUrl = 'https://api.countrystatecity.in/v1/countries';

export interface EmployeeDetailsParams {
  employeeId?: string;
}

export interface StatesParams {
  countryId: string;
}

export interface CitiesParams {
  stateId: string;
  countryId: string;
}

export const getEmployeeData = async ({
  employeeId,
}: EmployeeDetailsParams): Promise<EmployeeDataApiResponse> => {
  try {
    const response = await baseAPI.get(`/employee/${employeeId}`);
    return schemaParse(employeeDataApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching leave list records:', error);
    throw error;
  }
};

export const getEmployeeSalaryData = async ({
  employeeId,
}: EmployeeDetailsParams): Promise<SalaryType> => {
  try {
    const response = await baseAPI.get(
      `/get-user-salary-increments/${employeeId}`,
    );
    return schemaParse(salarySchema)(response);
  } catch (error) {
    console.error('Error fetching leave list records:', error);
    throw error;
  }
};

export type SuccessMessageResponse = {
  message: string;
};

export const addEmployeeSalaryIncrementData = async ({
  empId,
  incrementTitle,
  incrementAmount,
}: AddSalaryIncrementFormData): Promise<SuccessMessageResponse> => {
  try {
    const { message }: SuccessMessageResponse = await baseAPI.post(
      '/add-salary-increment',
      {
        empId,
        incrementTitle,
        incrementAmount,
      },
    );
    return { message };
  } catch (error) {
    console.error('Error adding salary increment data', error);
    throw error;
  }
};

export const updateEmployeeSalaryIncrementData = async ({
  incrementId,
  empId,
  incrementTitle,
  incrementAmount,
}: {
  incrementId: string;
  empId: string;
  incrementTitle: string;
  incrementAmount: number;
}): Promise<SuccessMessageResponse> => {
  try {
    const { message }: SuccessMessageResponse = await baseAPI.put(
      '/update-salary-increment',
      {
        incrementId,
        empId,
        incrementTitle,
        incrementAmount,
      },
    );
    return { message };
  } catch (error) {
    console.error('Error updating Salary Increment Data', error);
    throw error;
  }
};

export const deleteEmployeeSalaryIncrementData = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  try {
    const { message }: SuccessMessageResponse = await baseAPI.delete(
      `/delete-salary-increment?incrementId=${id}`,
    );
    return { message };
  } catch (error) {
    console.error('Error deleting Salary Increment Data', error);
    throw error;
  }
};

export const addEmployeeDesignationData = async ({
  id,
  position,
}: {
  id: string;
  position: string;
}): Promise<SuccessMessageResponse> => {
  try {
    const { message }: SuccessMessageResponse = await baseAPI.post(
      `/employee/${id}/designation/add`,
      {
        position,
      },
    );
    return { message };
  } catch (error) {
    console.error('Error adding designation data', error);
    throw error;
  }
};

export const deleteEmployeeDesignationData = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const [empId, designationId] = id.split('-');
  try {
    const { message }: SuccessMessageResponse = await baseAPI.delete(
      `/employee/${empId}/designation/${designationId}`,
    );
    return { message };
  } catch (error) {
    console.error('Error deleting designation data', error);
    throw error;
  }
};

export const getCountryList = async (): Promise<CountryApiResponse> => {
  try {
    const response = await axios.get(apiUrl, {
      headers: { 'X-CSCAPI-KEY': apiKey },
    });
    return countryApiResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Error fetching country list:', error);
    throw error;
  }
};

export const getStatesList = async ({
  countryId,
}: {
  countryId: string;
}): Promise<CountryApiResponse> => {
  try {
    const response = await axios.get(`${apiUrl}/${countryId}/states`, {
      headers: { 'X-CSCAPI-KEY': apiKey },
    });
    return countryApiResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Error fetching states list:', error);
    throw error;
  }
};

export const getCitiesList = async ({
  countryId,
  stateId,
}: {
  countryId: string;
  stateId: string;
}): Promise<CityApiResponse> => {
  try {
    const response = await axios.get(
      `${apiUrl}/${countryId}/states/${stateId}/cities`,
      {
        headers: { 'X-CSCAPI-KEY': apiKey },
      },
    );
    return cityApiResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Error fetching states list:', error);
    throw error;
  }
};

export const updateEmployeeAddress = async ({
  id,
  data,
}: {
  id: string;
  data: {
    street: string;
    landMark: string;
    country: string;
    province: string;
    city: string;
    zip: string;
    full: string;
  };
}) => {
  try {
    const { message }: SuccessMessageResponse = await baseAPI.put(
      `/employee/${id}`,
      {
        Address: data,
      },
    );
    return { message };
  } catch (error) {
    console.error('Error updating employee address', error);
    throw error;
  }
};
