import { useEffect } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  Notification,
  NotificationQueryResult,
} from '@/components/NotificationIcon/types';

import {
  fetchNotificationsEmp,
  fetchNotificationsHR,
  markNotificationAsRead,
} from '@/services/notification.service';
import { useNotificationStore } from '@/stores/useNotificationStore';

export const useNotificationsHR = (): NotificationQueryResult => {
  const setNotifications = useNotificationStore(
    state => state.setNotifications,
  );

  const query = useQuery<Notification[]>({
    queryKey: ['notificationsHR'],
    queryFn: fetchNotificationsHR,
    refetchOnWindowFocus: true,
    staleTime: 1 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setNotifications(query.data);
    }
  }, [query.data, setNotifications]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error ?? null,
  };
};

export const useNotificationsEmp = (id: string): NotificationQueryResult => {
  const setNotifications = useNotificationStore(
    state => state.setNotifications,
  );

  const query = useQuery<Notification[]>({
    queryKey: ['notificationsEmp', id],
    queryFn: () => fetchNotificationsEmp(id),
    refetchOnWindowFocus: true,
    staleTime: 1 * 60 * 1000,
    refetchOnMount: true,
    enabled: !!id,
  });

  useEffect(() => {
    if (query.data) {
      setNotifications(query.data);
    }
  }, [query.data, setNotifications]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ['notifications'] })
        .catch(error => {
          console.error('Error invalidating notifications query', error);
        });

      queryClient
        .invalidateQueries({ queryKey: ['notificationsEmp'] })
        .catch(error => {
          console.error(
            'Error invalidating employee notifications query',
            error,
          );
        });
    },
  });
};
