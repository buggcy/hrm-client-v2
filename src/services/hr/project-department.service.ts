import {
  DepartmentApiResponse,
  departmentApiResponseSchema,
  DepartmentChartApiResponse,
  DepartmentChartApiResponseSchema,
  DepartmentListApiResponse,
  departmentListApiResponseSchema,
  ProjectApiResponse,
  projectApiResponseSchema,
  ProjectChartApiResponse,
  ProjectChartApiResponseSchema,
  ProjectListApiResponse,
  projectListApiResponseSchema,
} from '@/libs/validations/project-department';
import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from './employee.service';

export interface ProjectParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  status?: string[];
  isActive?: string[];
}

export interface RecordParams {
  from?: string;
  to?: string;
}

export interface DepartmentParams {
  page?: number;
  limit?: number;
}

export interface ProjectBody {
  userId?: string;
  title?: string;
  description?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  deadline?: string;
  isActive?: boolean;
  techStack?: string[];
  teamLead?: string;
  status?: string;
  teamMembers?: string[];
  deletedTechStack?: string[];
  deletedTechMembers?: string[];
}

export interface DepartmentBody {
  userId?: string;
  head?: string;
  director?: string;
  name?: string;
  projects?: string[];
  employees?: string[];
  deleteEmployees?: string[];
  deleteProjects?: string[];
}

export const getProjects = async (
  params: ProjectParams = {},
): Promise<ProjectListApiResponse> => {
  const defaultParams: ProjectParams = {
    page: 1,
    limit: 5,
    from: '',
    to: '',
    isActive: [],
    status: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/get/projects`, mergedParams);
    return schemaParse(projectApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const searchProjects = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<ProjectListApiResponse> => {
  const { data, pagination }: ProjectListApiResponse = await baseAPI.get(
    `/search/projects?page=${page}&limit=${limit}&query=${query}`,
  );

  return { data, pagination };
};

export const deleteProjects = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/delete/project/${id}`,
  );
  return { message };
};

export const getProjectList = async (): Promise<ProjectApiResponse> => {
  try {
    const res = await baseAPI.get(`/projects/list`);
    return schemaParse(projectListApiResponseSchema)(res);
  } catch (error) {
    console.error('Error fetching project list:', error);
    throw error;
  }
};

export const addProject = async ({
  body,
}: {
  body: ProjectBody;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/add/projects`,
    body,
  );
  return { message };
};

export const editProject = async ({
  id,
  body,
}: {
  id: string;
  body: ProjectBody;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/edit/project/${id}`,
    body,
  );
  return { message };
};

export const getProjectRecords = async (
  params: RecordParams = {},
): Promise<ProjectChartApiResponse> => {
  const defaultParams: RecordParams = {
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
      `/project/statistics?${queryParams.toString()}`,
    );
    return schemaParse(ProjectChartApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching project records:', error);
    throw error;
  }
};

export const getDepartments = async (
  params: DepartmentParams = {},
): Promise<DepartmentListApiResponse> => {
  const defaultParams: DepartmentParams = {
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
      `/get/departments?${queryParams.toString()}`,
    );
    return schemaParse(departmentApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching get departments:', error);
    throw error;
  }
};

export const getDepartmentList = async (): Promise<DepartmentApiResponse> => {
  try {
    const res = await baseAPI.get(`/department/list`);
    return schemaParse(departmentListApiResponseSchema)(res);
  } catch (error) {
    console.error('Error fetching department list:', error);
    throw error;
  }
};

export const searchDepartments = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<DepartmentListApiResponse> => {
  const { data, pagination }: DepartmentListApiResponse = await baseAPI.get(
    `/search/departments?page=${page}&limit=${limit}&query=${query}`,
  );

  return { data, pagination };
};

export const getDepartmentRecords =
  async (): Promise<DepartmentChartApiResponse> => {
    try {
      const res = await baseAPI.get(`/department/statistics`);
      return schemaParse(DepartmentChartApiResponseSchema)(res);
    } catch (error) {
      console.error('Error fetching department list:', error);
      throw error;
    }
  };

export const deleteDepartment = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/delete/department/${id}`,
  );
  return { message };
};

export const addDepartment = async ({
  body,
}: {
  body: DepartmentBody;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/add/departments`,
    body,
  );
  return { message };
};

export const editDepartment = async ({
  id,
  body,
}: {
  id: string;
  body: DepartmentBody;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/edit/department/${id}`,
    body,
  );
  return { message };
};
