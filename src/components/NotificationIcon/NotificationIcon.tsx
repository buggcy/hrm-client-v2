import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import {
  ArrowLeft,
  Bell,
  BellOff,
  CheckCircle,
  Loader,
  MoreHorizontal,
  User as UserIcon,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  useNotificationsEmp,
  useNotificationsHR,
} from '@/hooks/useNotification/useNotification';
import useNotificationActions from '@/hooks/useNotification/useNotificationActions';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { timeAgo } from '@/utils/notification.utills';

import { Button } from '../ui/button';

import { User } from '@/types/user.types';

const Notification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingNotificationId, setLoadingNotificationId] = useState<
    string | null
  >(null);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { setNotifications } = useNotificationStore();
  const { handleMarkAsRead, handleAllMarkAsRead } = useNotificationActions();

  useEffect(() => {
    const authStorage = sessionStorage.getItem('auth-storage');
    if (authStorage) {
      const parsedStorage = JSON.parse(authStorage);
      const user: User = parsedStorage?.state?.user;
      if (user) {
        setUserRole(user.roleId || null);
        setUserId(user.id || null);
      }
    }
  }, []);

  const { data: hrNotifications, isLoading: isLoadingHR } =
    useNotificationsHR();
  const { data: empNotifications, isLoading: isLoadingEmp } =
    useNotificationsEmp(userId || '');

  useEffect(() => {
    if (userRole === 1 && hrNotifications) {
      setNotifications(hrNotifications);
    } else if (userRole === 2 && empNotifications) {
      setNotifications(empNotifications);
    }
  }, [userRole, hrNotifications, empNotifications, setNotifications]);

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
    await handleAllMarkAsRead(sortedNotifications);
  };

  if (userRole === null || userId === null) {
    return <Loader size={24} className="animate-spin" />;
  }

  if ((userRole === 1 && isLoadingHR) || (userRole === 2 && isLoadingEmp)) {
    return <Loader size={24} className="animate-spin" />;
  }
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={`Notifications (${unreadCount} unread)`}
          className="relative flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 p-1 hover:bg-gray-200"
        >
          <Bell size={28} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 inline-flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-bold leading-none text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        style={{ width: '30vw' }}
        className="absolute -left-0 min-w-[300px] -translate-x-full"
      >
        <DropdownMenu>
          <div className="flex items-center justify-between p-4">
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
        <ScrollArea className="h-72" style={{ width: '30vw' }}>
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
                className="relative flex items-center p-2"
                style={{
                  width: '29vw',
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

                <div style={{ marginRight: '1rem', marginLeft: '0.5rem' }}>
                  {notification.senderId?.Avatar ? (
                    <img
                      src={notification.senderId.Avatar}
                      alt="Sender Avatar"
                      className="size-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon size={48} className="text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-bold">
                      {notification.senderId?.firstName || 'Unknown'}{' '}
                      {notification.senderId?.lastName || 'User'}
                    </span>{' '}
                    {notification.message}
                  </p>
                </div>

                <div className="mr-2 text-xs text-gray-500">
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
                userRole === 1
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
