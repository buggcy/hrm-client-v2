import { AddHrEventsFormData } from '@/app/(portal)/(hr)/hr/manage-events/components/AddHrEventsDialog';
import { AddHrEventsFormData as EditHrEventsFormData } from '@/app/(portal)/(hr)/hr/manage-events/components/EditHrEventsDialog';
import {
  HrEventsApiResponse,
  hrEventsApiResponseSchema,
} from '@/libs/validations/employee';
import { baseAPI, schemaParse } from '@/utils';

export interface HrEventsListParams {
  page?: number;
  limit?: number;
  hrStatus?: string[];
}

export type SuccessMessageResponse = {
  message: string;
};

export const getHrEventsList = async (
  params: HrEventsListParams = {},
): Promise<HrEventsApiResponse> => {
  const defaultParams: HrEventsListParams = {
    page: 1,
    limit: 5,
    hrStatus: [],
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
      `/events/listV2?${queryParams.toString()}`,
    );
    return schemaParse(hrEventsApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching hr events list:', error);
    throw error;
  }
};

export const hrEventsLists = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<HrEventsApiResponse> => {
  const res = await baseAPI.get(
    `/events/listV2/search?page=${page}&limit=${limit}&query=${query}`,
  );
  return schemaParse(hrEventsApiResponseSchema)(res);
};

export const addHrEventsData = async ({
  EventTitle,
  Description,
  Start_Date,
  End_Date,
  EventType,
  status,
  hrId,
}: AddHrEventsFormData): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(`/events`, {
    Event_Name: EventTitle,
    Event_Start: Start_Date,
    Event_End: End_Date,
    Event_Discription: Description,
    Event_Type: EventType,
    isEnabled: status,
    hrId,
  });
  return { message };
};

export const editHrEventsData = async (
  id: string,
  data: EditHrEventsFormData,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/events/${id}`,
    {
      Event_Name: data.EventTitle,
      Event_Start: data.Start_Date,
      Event_End: data.End_Date,
      Event_Discription: data.Description,
      Event_Type: data.EventType,
      isEnabled: data.status,
    },
  );
  return { message };
};

export const deleteHrEvent = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  try {
    const { message }: SuccessMessageResponse = await baseAPI.delete(
      `/events/${id}`,
    );
    return { message };
  } catch (error) {
    console.error('Error deleting HR event:', error);
    throw error;
  }
};

export const searchHrEventsList = async ({
  query,
  page,
  limit,
  hrStatus,
}: {
  query: string;
  page: number;
  limit: number;
  hrStatus: string[];
}): Promise<HrEventsApiResponse> => {
  const { data, pagination }: HrEventsApiResponse = await baseAPI.post(
    `/hrevent/search`,
    { query, page, limit, hrStatus },
  );

  return { data, pagination };
};

export const exportEventsCSVData = async (
  ids: Array<string>,
): Promise<BlobPart> => {
  const res: BlobPart = await baseAPI.post(`/event/export-csv`, { ids });
  return res;
};
