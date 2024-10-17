import {
  Designation,
  DesignationApiResponse,
  designationApiResponseSchema,
  DesignationQueryParamsType,
} from '@/libs/validations/hr-designation.validation';
import { baseAPI } from '@/utils';

type SuccessMessageResponse = {
  message: string;
};

export const designationService = {
  fetchAllDesignations: async (
    params: DesignationQueryParamsType,
  ): Promise<DesignationApiResponse> => {
    const { page, limit, status } = params;
    const url = `/type/all?page=${page}&limit=${limit}&status=${status}`;
    const response = await baseAPI.get<DesignationApiResponse>(url);
    return designationApiResponseSchema.parse(response);
  },

  deleteDesignation: async (
    id: string,
    status: string,
  ): Promise<SuccessMessageResponse> => {
    const response: SuccessMessageResponse = await baseAPI.delete(
      `/delete/types/${id}/status/${status}`,
    );
    return response;
  },

  addDesignation: async (
    data: Partial<Designation>,
  ): Promise<SuccessMessageResponse> => {
    const response: SuccessMessageResponse = await baseAPI.post(
      `/add/types`,
      data,
    );
    console.log('service add', response);
    return response;
  },

  editDesignation: async (
    id: string,
    data: Partial<Designation>,
  ): Promise<SuccessMessageResponse> => {
    const response: SuccessMessageResponse = await baseAPI.put(
      `/edit/types/${id}`,
      data,
    );
    console.log('front service id', id);

    return response;
  },
};
