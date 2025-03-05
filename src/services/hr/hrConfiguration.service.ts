import {
  ConfigurationApiResponse,
  configurationApiResponseSchema,
} from '@/libs/validations/hr-configuration';
import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from './employee.service';

export interface ConfigurationParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const searchConfiguration = async ({
  status,
  query,
  page,
  limit,
}: {
  status: string;
  query: string;
  page: number;
  limit: number;
}): Promise<ConfigurationApiResponse> => {
  const { data, pagination }: ConfigurationApiResponse = await baseAPI.get(
    `/search/type?status=${status}&page=${page}&limit=${limit}&query=${query}`,
  );
  return { data, pagination };
};

export const getConfigurationType = async (
  params: ConfigurationParams = {},
): Promise<ConfigurationApiResponse> => {
  const defaultParams: ConfigurationParams = {
    status: '',
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
    const response = await baseAPI.get(`/type/all?${queryParams.toString()}`);
    return schemaParse(configurationApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching configuration type list!', error);
    throw error;
  }
};

export const deleteType = async (payload: {
  status: string;
  id: string;
}): Promise<SuccessMessageResponse> => {
  const { status, id } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `delete/types/${id}/status/${status}`,
  );
  return { message };
};

export const addEducationType = async (payload: {
  userId: string;
  educationType?: string;
}): Promise<SuccessMessageResponse> => {
  const { userId, educationType } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.post(`/add/types`, {
    userId,
    status: 'education',
    educationType,
  });
  return { message };
};

export const addExperienceType = async (payload: {
  userId: string;
  experienceType?: string;
}): Promise<SuccessMessageResponse> => {
  const { userId, experienceType } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.post(`/add/types`, {
    userId,
    status: 'experience',
    experienceType,
  });
  return { message };
};

export const addDesignationType = async (payload: {
  userId: string;
  designationType?: string;
  isIntern?: boolean;
  isProbational?: boolean;
}): Promise<SuccessMessageResponse> => {
  const { userId, designationType, isIntern, isProbational } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.post(`/add/types`, {
    userId,
    status: 'designation',
    designationType,
    isIntern,
    isProbational,
  });
  return { message };
};

export const editEducationType = async (payload: {
  id: string;
  userId: string;
  educationType?: string;
}): Promise<SuccessMessageResponse> => {
  const { id, userId, educationType } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/edit/types/${id}`,
    {
      userId,
      status: 'education',
      educationType,
    },
  );
  return { message };
};

export const editExperienceType = async (payload: {
  id: string;
  userId: string;
  experienceType?: string;
}): Promise<SuccessMessageResponse> => {
  const { id, userId, experienceType } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/edit/types/${id}`,
    {
      userId,
      status: 'experience',
      experienceType,
    },
  );
  return { message };
};

export const editDesignationType = async (payload: {
  id: string;
  userId: string;
  designationType?: string;
}): Promise<SuccessMessageResponse> => {
  const { id, userId, designationType } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/edit/types/${id}`,
    {
      userId,
      status: 'designation',
      designationType,
    },
  );
  return { message };
};

export const addFeedbackType = async (payload: {
  userId: string;
  feedbackType?: string;
}): Promise<SuccessMessageResponse> => {
  const { userId, feedbackType } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.post(`/add/types`, {
    userId,
    status: 'feedback',
    feedbackType,
  });
  return { message };
};

export const editFeedbackType = async (payload: {
  id: string;
  userId: string;
  feedbackType?: string;
}): Promise<SuccessMessageResponse> => {
  const { id, userId, feedbackType } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/edit/types/${id}`,
    {
      userId,
      status: 'feedback',
      feedbackType,
    },
  );
  return { message };
};

export const addTimeCutOffType = async (payload: {
  userId: string;
  timeCutOff?: number;
  startTime: string;
  endTime: string;
}): Promise<SuccessMessageResponse> => {
  const { userId, timeCutOff, startTime, endTime } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.post(`/add/types`, {
    userId,
    status: 'timecutoff',
    timeCutOff,
    startTime,
    endTime,
  });
  return { message };
};
