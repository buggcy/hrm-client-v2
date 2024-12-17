'use client';
import React, { useEffect, useMemo, useState } from 'react';

import { Loader } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStores } from '@/providers/Store.Provider';

import {
  useNotificationsEmp,
  useNotificationsHR,
} from '@/hooks/useNotification/useNotification';
import useNotificationActions from '@/hooks/useNotification/useNotificationActions';
import { AuthStoreType } from '@/stores/auth';
import { useNotificationStore } from '@/stores/useNotificationStore';

import { NotificationFooter } from './components/NotificationFooter';
import { NotificationHeader } from './components/NotificationHeader';
import { NotificationList } from './components/NotificationList';
import { NotificationIcon } from './components/NotificationsIcon';

export const Notification: React.FC = () => {
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

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
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
      <DropdownMenuTrigger asChild onClick={toggleDropdown}>
        <div>
          <NotificationIcon unreadCount={unreadCount} />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="absolute left-2 min-w-[350px] -translate-x-full md:left-6">
        <NotificationHeader
          unreadCount={unreadCount}
          handleMarkAllAsRead={handleMarkAllAsRead}
        />
        <DropdownMenuSeparator />
        <NotificationList
          sortedNotifications={sortedNotifications}
          isMarkingAllAsRead={isMarkingAllAsRead}
          loadingNotificationId={loadingNotificationId}
          handleMarkAsReadClick={handleMarkAsReadClick}
        />
        <DropdownMenuSeparator />
        <NotificationFooter />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
