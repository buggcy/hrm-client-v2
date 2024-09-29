// External imports first
import { useEffect } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Internal imports (aliased paths)
import {
  fetchNotificationsEmp,
  fetchNotificationsHR,
  markNotificationAsRead,
} from '@/services/notification.service';
import { useNotificationStore } from '@/stores/useNotificationStore';

export const useNotificationsHR = () => {
  const setNotifications = useNotificationStore(
    state => state.setNotifications,
  );

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotificationsHR,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setNotifications(query.data);
    }
  }, [query.data, setNotifications]);

  return query;
};

export const useNotificationsEmp = (id: string) => {
  const setNotifications = useNotificationStore(
    state => state.setNotifications,
  );

  const query = useQuery({
    queryKey: ['notificationsEmp', id],
    queryFn: () => fetchNotificationsEmp(id),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setNotifications(query.data);
    }
  }, [query.data, setNotifications]);

  return query;
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      // await the promise here to avoid floating promise issues
      await markNotificationAsRead(notificationId); // <-- This is correct since it's awaited here.
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
