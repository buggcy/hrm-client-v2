// Internal imports (aliased paths)
import { Notification } from '@/components/NotificationIcon/types';

import { baseAPI } from '@/utils';

const fetchNotificationsHR = async (): Promise<Notification[]> => {
  const response = await baseAPI.get<Notification[]>('/notifications');

  return Array.isArray(response.data)
    ? response.data
    : (response as unknown as Notification[]);
};

const fetchNotificationsEmp = async (id: string) => {
  const response = await baseAPI.get<Notification[]>(
    `/notifications/employee/${id}`,
  );
  return Array.isArray(response.data)
    ? response.data
    : (response as unknown as Notification[]);
};

const markNotificationAsRead = async (id: string) => {
  const response = await baseAPI.patch<Notification>(
    `/notifications/${id}/read`,
  );
  return response.data;
};

export { fetchNotificationsHR, fetchNotificationsEmp, markNotificationAsRead };
