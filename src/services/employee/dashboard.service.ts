import { baseAPI } from '@/utils';

import { SuccessMessageResponse } from '../hr/employee.service';

import { RecentAnnouncement } from '@/types/announcement.types';
import {
  AttendanceData,
  AttendanceReport,
  Attendence,
  ChartData,
} from '@/types/attendence.types';
import { BirthdayResponse } from '@/types/Birthday.types';
import { EventData, RawEventData } from '@/types/events.types';
export interface EmployeeDashboardParams {
  from?: string;
  to?: string;
}
export const fetchMonthlyAttendanceChartData = async (
  taho_id: string,
  params: EmployeeDashboardParams = {},
): Promise<ChartData[]> => {
  const defaultParams: EmployeeDashboardParams = {
    from: '',
    to: ',',
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
  const response = await baseAPI.get(
    `/attendence-monthly/${taho_id}?${queryParams.toString()}`,
  );
  const data: Attendence[] = response?.data;

  const formattedData: ChartData[] = data.map((item, index) => {
    const [hours, minutes] = item.totalHours.split(':').map(Number);
    return {
      name: (index + 1).toString(),
      Hours: hours + minutes / 60,
      totalHours: item.totalHours,
      date: item.date,
      status: item.status,
      startTime: item.startTime,
      endTime: item.endTime,
    };
  });

  return formattedData;
};

export const fetchWeeklyAttendance = async (
  taho_id: string,
): Promise<AttendanceData> => {
  const response: AttendanceData = await baseAPI.get(
    `/attendance-weekly/${taho_id}`,
  );
  return response;
};
export const fetchCurrentMonthEvents = async (): Promise<EventData[]> => {
  const response = await baseAPI.get<RawEventData[]>(
    `/events/list?currentMonth=true&isEnabled=true`,
  );
  const events: EventData[] = response.data.map((event: RawEventData) => ({
    id: event._id,
    title: event.Event_Name,
    start: new Date(event.Event_Start),
    end: new Date(event.Event_End),
    Event_Discription: event.Event_Discription,
    type: event.Event_Type,
    hrId: event.hrId,
    isEnabled: event.isEnabled,
  }));
  return events;
};

export const fetchWeeklyEvents = async (): Promise<EventData[]> => {
  const response = await baseAPI.get<RawEventData[]>(`/weekly/events`);
  const events: EventData[] = response?.data?.map((event: RawEventData) => ({
    id: event._id,
    title: event.Event_Name,
    start: new Date(event.Event_Start),
    end: new Date(event.Event_End),
    Event_Discription: event.Event_Discription,
    type: event.Event_Type,
    hrId: event.hrId,
    isEnabled: event.isEnabled,
  }));
  return events;
};

export const fetchAttendanceReport = async (
  tahometerId: string,
  params: EmployeeDashboardParams = {},
): Promise<AttendanceReport | null> => {
  const defaultParams: EmployeeDashboardParams = {
    from: '',
    to: ',',
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
  const res: AttendanceReport = await baseAPI.get(
    `/attendance-report?tahometerId=${tahometerId}&${queryParams.toString()}`,
  );

  return res;
};

export const fetchRecentAnnouncements = async () => {
  const response: RecentAnnouncement = await baseAPI.get(
    `/recent?filter=weekly`,
  );
  return response;
};

export const fetchUpcomingBirthdays = async (): Promise<BirthdayResponse> => {
  const response: BirthdayResponse = await baseAPI.get('/birthdays');
  return response;
};

export const fetchWeeklyBirthdays = async (): Promise<BirthdayResponse> => {
  const response: BirthdayResponse = await baseAPI.get('/weekly/birthdays');
  return response;
};

export interface ResignedBody {
  employeeId: string;
  title: string;
  reason: string;
  description: string;
  appliedDate?: string;
  immedaiteDate?: string;
  isResigned: boolean;
  type?: string;
}

export const ApplyResignation = async ({
  body,
}: {
  body: ResignedBody;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/resignation/apply`,
    body,
  );
  return { message };
};
