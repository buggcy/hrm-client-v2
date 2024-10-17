import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  Designation,
  DesignationApiResponse,
  DesignationQueryParamsType,
} from '@/libs/validations/hr-designation.validation';
import { designationService } from '@/services/hr/hr-designation.services';
type SuccessMessageResponse = {
  message: string;
};

export const useFetchAllDesignations = (params: DesignationQueryParamsType) => {
  return useQuery<DesignationApiResponse, Error>({
    queryKey: ['allDesignations', params],
    queryFn: () => designationService.fetchAllDesignations(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useDeleteDesignation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessMessageResponse,
    Error,
    { id: string; status: string }
  >({
    mutationFn: ({ id, status }) =>
      designationService.deleteDesignation(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['allDesignations'] });
    },
  });
};

export const useAddDesignation = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessMessageResponse, Error, Partial<Designation>>({
    mutationFn: data => designationService.addDesignation(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['allDesignations'] });
    },
  });
};

export const useEditDesignation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessMessageResponse,
    Error,
    { id: string; data: Partial<Designation> }
  >({
    mutationFn: ({ id, data }) => designationService.editDesignation(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['allDesignations'] });
    },
  });
};
