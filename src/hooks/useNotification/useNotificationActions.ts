// hooks/useNotificationActions.ts
import { useCallback } from 'react';

import { Notification } from '@/components/NotificationIcon/types'; // Assuming you have a type for notifications
import { toast } from '@/components/ui/use-toast';

import { useMarkNotificationAsRead } from '@/hooks/useNotification/useNotification';
import { useNotificationStore } from '@/stores/useNotificationStore';

const useNotificationActions = () => {
  const { setNotifications, notifications } = useNotificationStore();
  const markAsReadMutation = useMarkNotificationAsRead();

  const updateNotificationState = useCallback(
    (id: string, isRead: boolean) => {
      setNotifications(
        notifications.map(notification =>
          notification._id === id ? { ...notification, isRead } : notification,
        ),
      );
    },
    [notifications, setNotifications],
  );

  const handleMarkAsRead = async (id: string, showToast = true) => {
    console.log(`Marking notification ${id} as read. Show toast: ${showToast}`);

    try {
      await markAsReadMutation.mutateAsync(id);
      updateNotificationState(id, true);

      if (showToast) {
        toast({
          title: 'Success',
          description: 'Notification marked as read.',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      if (showToast) {
        toast({
          title: 'Error',
          description: 'Failed to mark notification as read.',
          variant: 'error',
        });
      }
    }
  };

  const handleAllMarkAsRead = async (notificationsToMark: Notification[]) => {
    try {
      const unreadNotifications = notificationsToMark.filter(
        notification => !notification.isRead,
      );

      await Promise.all(
        unreadNotifications.map(notification =>
          markAsReadMutation.mutateAsync(notification._id),
        ),
      );

      setNotifications(
        notifications.map(notification =>
          unreadNotifications.some(unread => unread._id === notification._id)
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      toast({
        title: 'Success',
        description: 'All notifications marked as read.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read.',
        variant: 'error',
      });
    }
  };

  return { handleMarkAsRead, handleAllMarkAsRead };
};

export default useNotificationActions;
