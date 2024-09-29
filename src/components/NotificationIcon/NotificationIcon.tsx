import React, { useCallback, useEffect, useState } from 'react';

import { AlertCircle, Bell, Loader } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';

import {
  useMarkNotificationAsRead,
  useNotificationsEmp,
  useNotificationsHR,
} from '@/hooks/useNotification';
import { useNotificationStore } from '@/stores/useNotificationStore';

const Notification: React.FC = () => {
  const { notifications, setNotifications } = useNotificationStore(state => ({
    notifications: state.notifications,
    setNotifications: state.setNotifications,
  }));
  const [unreadCount, setUnreadCount] = useState(0);
  const [isHR, setIsHR] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const [loadingNotificationId, setLoadingNotificationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const authStorage = sessionStorage.getItem('auth-storage');
    if (authStorage) {
      const parsedStorage = JSON.parse(authStorage);
      const user = parsedStorage.state?.user;
      const userId: string | null = user?.id || null;
      setUserId(userId);
      setIsHR(user?.roleId === 1);
    }
  }, []);

  useEffect(() => {
    setUnreadCount(
      notifications.filter(notification => !notification.isRead).length,
    );
  }, [notifications]);

  const notificationsHR = useNotificationsHR();
  const notificationsEmp = useNotificationsEmp(userId!);

  const isLoading = isHR
    ? notificationsHR.isLoading
    : notificationsEmp.isLoading;
  const error = isHR ? notificationsHR.error : notificationsEmp.error;

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

    setLoadingNotificationId(id);
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
      if (showToast) {
        toast({
          title: 'Error',
          description: 'Failed to mark notification as read.',
          variant: 'error',
        });
      }
    } finally {
      setLoadingNotificationId(null);
    }
  };

  const handleAllMarkAsRead = async () => {
    setIsMarkingAllAsRead(true);

    try {
      const unreadNotifications = notifications.filter(
        notification => !notification.isRead,
      );
      await Promise.all(
        unreadNotifications.map(notification =>
          handleMarkAsRead(notification._id, false),
        ),
      );

      setNotifications(
        notifications.map(notification => ({ ...notification, isRead: true })),
      );

      toast({
        title: 'Success',
        description: 'All notifications have been marked as read.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read.',
        variant: 'error',
      });
    } finally {
      setIsMarkingAllAsRead(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader className="mr-2 size-4 animate-spin" />
        <p>Loading notifications...</p>
      </div>
    );
  }
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load notifications. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={`Notifications (${unreadCount} unread)`}
          className="relative flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 p-1 hover:bg-gray-200"
        >
          <Bell size={28} />
          <span className="absolute right-1 top-1 inline-flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-bold leading-none text-red-100">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute -left-0 min-w-[400px] -translate-x-full">
        <div
          style={{
            background: '#ebebeb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 0.5rem',
          }}
        >
          <h1 className="font-bold">Activity Feed</h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '1rem',
            }}
          >
            <span className="text-sm text-gray-500">
              <span className="font-bold">{unreadCount}</span> unread
            </span>
            <button
              className="text-sm text-gray-500 underline"
              onClick={handleAllMarkAsRead}
              disabled={isMarkingAllAsRead}
            >
              Mark all as read
            </button>
          </div>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {isMarkingAllAsRead ? (
            <div className="absolute inset-0 flex h-full items-center justify-center bg-gray-100 opacity-50">
              <Loader size={40} className="animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            notifications.map(notification => (
              <DropdownMenuItem
                onClick={e => {
                  e.preventDefault();
                }}
                key={notification._id}
                className="relative border-b border-gray-200"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  paddingBottom: '1rem',
                  paddingTop: '1rem',
                  opacity: loadingNotificationId === notification._id ? 0.5 : 1,
                }}
              >
                {loadingNotificationId === notification._id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 opacity-50">
                    <Loader size={24} className="animate-spin" />
                  </div>
                )}
                <div
                  style={{ marginLeft: notification.isRead ? '0' : '0.5rem' }}
                >
                  {!notification.isRead && (
                    <span style={{ color: 'blue', marginRight: '0.5rem' }}>
                      ●
                    </span>
                  )}
                  <span className="font-bold capitalize">
                    {notification.senderId?.firstName || 'Unknown First Name'}{' '}
                    {notification.senderId?.lastName || 'Unknown Last Name'}
                  </span>

                  <p
                    style={{
                      maxWidth: '20vw',
                      overflow: 'hidden',
                      wordWrap: 'break-word',
                      whiteSpace: 'normal',
                      display: 'inline',
                    }}
                    className="mb-1 text-sm font-medium"
                  >
                    {notification.message}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <small className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </small>
                  {loadingNotificationId !== notification._id &&
                    (notification.isRead ? (
                      <span className="ml-4 cursor-default text-sm text-gray-500">
                        ✔ Read
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="ml-4 text-sm text-blue-600 hover:underline"
                      >
                        Mark as Read
                      </button>
                    ))}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { Notification };
