import { Notification } from '@/components/NotificationIcon/types';

import { useAuthStore } from '@/stores/auth';
import { baseAPI } from '@/utils';

const fetchNotificationsHR = async (): Promise<Notification[]> => {
  const { token, user } = useAuthStore.getState();
  if (!token || user?.roleId !== 1) return [];

  const response = await baseAPI.get<Notification[]>('/notifications');

  return Array.isArray(response.data)
    ? response.data
    : (response as unknown as Notification[]);
};

const fetchNotificationsEmp = async (id: string) => {
  const { token, user } = useAuthStore.getState();
  if (!token || user?.roleId !== 2) return [];

  const response = await baseAPI.get<Notification[]>(
    `/notifications/employee/${id}`,
  );
  return Array.isArray(response.data)
    ? response.data
    : (response as unknown as Notification[]);
};

const markNotificationAsRead = async (id: string) => {
  const { token } = useAuthStore.getState();
  if (!token) return;

  const response = await baseAPI.patch<Notification>(
    `/notifications/${id}/read`,
  );
  return response.data;
};

export { fetchNotificationsHR, fetchNotificationsEmp, markNotificationAsRead };
