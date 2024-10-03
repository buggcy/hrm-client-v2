import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import {
  ArrowLeft,
  Bell,
  BellOff,
  CheckCircle,
  Loader,
  MoreHorizontal,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStores } from '@/providers/Store.Provider';

import {
  useNotificationsEmp,
  useNotificationsHR,
} from '@/hooks/useNotification/useNotification';
import useNotificationActions from '@/hooks/useNotification/useNotificationActions';
import { AuthStoreType } from '@/stores/auth';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { timeAgo } from '@/utils/notification.utills';

import { Button } from '../ui/button';

const Notification: React.FC = () => {
  const { authStore } = useStores() as { authStore: AuthStoreType };

  const { user } = authStore;

  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [loadingNotificationId, setLoadingNotificationId] = useState<
    string | null
  >(null);

  const { setNotifications } = useNotificationStore();
  const { handleMarkAsRead, handleAllMarkAsRead } = useNotificationActions();

  const { data: hrNotifications, isLoading: isLoadingHR } =
    useNotificationsHR();
  const { data: empNotifications, isLoading: isLoadingEmp } =
    useNotificationsEmp(user?.id || '');

  useEffect(() => {
    if (user?.roleId === 1 && hrNotifications) {
      setNotifications(hrNotifications);
    } else if (user?.roleId === 2 && empNotifications) {
      setNotifications(empNotifications);
    }
  }, [user?.roleId, hrNotifications, empNotifications, setNotifications]);

  const { notifications } = useNotificationStore();

  const sortedNotifications = useMemo(() => {
    return [...notifications]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return sortedNotifications.filter(notification => !notification.isRead)
      .length;
  }, [sortedNotifications]);

  const handleMarkAsReadClick = async (id: string) => {
    setLoadingNotificationId(id);
    await handleMarkAsRead(id);
    setLoadingNotificationId(null);
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAllAsRead(true);
    await handleAllMarkAsRead(sortedNotifications);
    setIsMarkingAllAsRead(false);
  };

  if (user?.roleId === null || user?.id === null) {
    return <Loader size={24} className="animate-spin" />;
  }

  if (
    (user?.roleId === 1 && isLoadingHR) ||
    (user?.roleId === 2 && isLoadingEmp)
  ) {
    return <Loader size={24} className="animate-spin" />;
  }
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Notifications (${unreadCount} unread)`}
          className="relative flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 p-1"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 inline-flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-bold leading-none text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        style={{ width: '30vw' }}
        className="absolute -left-0 min-w-[300px] -translate-x-full"
      >
        <DropdownMenu>
          <div className="flex items-center justify-between p-2">
            <h1 className="font-bold">Notifications</h1>
            <div className="flex items-center gap-2">
              <DropdownMenuTrigger asChild>
                <button className="rounded-md p-1 hover:bg-gray-200">
                  <MoreHorizontal size={24} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="absolute -left-0 min-w-[170px] -translate-x-full">
                <div className="mr-1 flex items-center justify-between">
                  <DropdownMenuLabel>Activity Feed</DropdownMenuLabel>
                  <span className="text-sm text-gray-500">
                    <span className="ml-2 flex size-7 items-center justify-center rounded-full bg-muted">
                      {unreadCount}
                    </span>
                  </span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex w-full items-center p-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-blue-500"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCircle className="mr-2 size-4" />
                  Mark all as read
                </DropdownMenuItem>
              </DropdownMenuContent>
            </div>
          </div>
        </DropdownMenu>

        <DropdownMenuSeparator />
        <ScrollArea className="h-72 w-full">
          {isMarkingAllAsRead && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
              <Loader className="mr-2 animate-spin" />
            </div>
          )}
          {sortedNotifications.length === 0 ? (
            <div className="flex items-center justify-start p-4 text-gray-500">
              <BellOff className="mr-3 size-5 text-gray-400" />
              <p className="text-sm font-medium">No notifications available</p>
            </div>
          ) : (
            sortedNotifications.map(notification => (
              <DropdownMenuItem
                onClick={e => {
                  e.preventDefault();
                }}
                key={notification._id}
                className="relative flex w-full items-center p-2"
                style={{
                  paddingBottom: '0.5rem',
                  paddingTop: '0.5rem',
                  opacity: loadingNotificationId === notification._id ? 0.5 : 1,
                }}
              >
                {loadingNotificationId === notification._id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 opacity-50">
                    <Loader size={24} className="animate-spin" />
                  </div>
                )}

                <Avatar className="mr-2 size-10">
                  <AvatarImage
                    src={notification.senderId?.Avatar || ''}
                    alt={`${notification.senderId?.firstName || 'Unknown'} ${notification.senderId?.lastName || 'User'}`}
                  />
                  <AvatarFallback className="uppercase">
                    {`${notification.senderId?.firstName?.charAt(0) || ''}${notification.senderId?.lastName?.charAt(0) || ''}`}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-bold">
                      {notification.senderId?.firstName || 'Unknown'}{' '}
                      {notification.senderId?.lastName || 'User'}
                    </span>{' '}
                    {notification.message}
                  </p>
                </div>

                <div className="mx-2 text-xs text-gray-500">
                  {timeAgo(notification.createdAt)}
                </div>

                {!notification.isRead && (
                  <span
                    className="cursor-pointer text-lg text-blue-500"
                    onClick={() => handleMarkAsReadClick(notification._id)}
                  >
                    ●
                  </span>
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
        <div className="my-2 flex justify-center">
          <Button asChild className="w-[95%]">
            <Link
              href={
                user?.roleId === 1
                  ? '/hr/all-notifications'
                  : '/employee/all-notifications'
              }
            >
              <ArrowLeft className="mr-2 size-4" />
              View All Notifications
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { Notification };
