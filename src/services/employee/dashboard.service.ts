import { baseAPI } from '@/utils';

import { RecentAnnouncement } from '@/types/announcement.types';
import {
  AttendanceData,
  AttendanceReport,
  Attendence,
  ChartData,
} from '@/types/attendence.types';
import { BirthdayResponse } from '@/types/Birthday.types';
import { EventData, RawEventData } from '@/types/events.types';

export const fetchMonthlyAttendanceChartData = async (
  taho_id: string,
): Promise<ChartData[]> => {
  const response = await baseAPI.get(`/attendence-monthly/${taho_id}`);
  const data: Attendence[] = response?.data;

  const formattedData: ChartData[] = data.map((item, index) => {
    const [hours] = item.totalHours.split(':').map(Number);
    return {
      name: (index + 1).toString(),
      Hours: hours,
      date: item.date,
    };
  });

  console.log('Monthly', formattedData);

  return formattedData;
};

export const fetchWeeklyAttendance = async (
  taho_id: string,
): Promise<AttendanceData> => {
  try {
    const response: AttendanceData = await baseAPI.get(
      `/attendance-weekly/${taho_id}`,
    );

    console.log('Employee API response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw error;
  }
};
export const fetchCurrentMonthEvents = async (): Promise<EventData[]> => {
  try {
    const response = await baseAPI.get<RawEventData[]>(
      `/events/list?currentMonth=true&isEnabled=true`,
    );
    console.log(response);
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
  } catch (error) {
    console.error('Error fetching events data:', error);
    throw error;
  }
};

export const fetchAttendanceReport = async (
  tahometerId: string,
  monthYear: string,
): Promise<AttendanceReport | null> => {
  if (!monthYear) return null;

  const [year, month] = monthYear.split('-');

  const res: AttendanceReport = await baseAPI.get(
    `/attendance-report?tahometerId=${tahometerId}&year=${year}&month=${month}`,
  );

  return res;
};

export const fetchRecentAnnouncements = async () => {
  try {
    const response: RecentAnnouncement = await baseAPI.get(`/recent`);
    console.log('announcnemt results', response);
    return response;
  } catch (err) {
    console.error('Error fetching events data:', err);
    throw err;
  }
};

export const fetchUpcomingBirthdays = async (): Promise<BirthdayResponse> => {
  const response: BirthdayResponse = await baseAPI.get('/birthdays');
  console.log(response);
  return response;
};
