'use client';

import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';

import {
  BadgeCheck,
  BellOff,
  CheckCircle,
  Eye,
  Loader,
  Mail,
  MoreHorizontal,
} from 'lucide-react';

import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon/NotificationIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStores } from '@/providers/Store.Provider';

import { useNotificationsEmp } from '@/hooks/useNotification/useNotification';
import useNotificationActions from '@/hooks/useNotification/useNotificationActions';
import { AuthStoreType } from '@/stores/auth';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { timeAgo } from '@/utils/notification.utills';

type FilterValue = 'all' | 'read' | 'unread';

const AllNotifications: FunctionComponent = () => {
  const { authStore } = useStores() as { authStore: AuthStoreType };

  const { user } = authStore;

  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const { notifications: storeNotifications, setNotifications } =
    useNotificationStore();
  const { handleMarkAsRead, handleAllMarkAsRead } = useNotificationActions();

  const { data: fetchedNotifications, isLoading } = useNotificationsEmp(
    user?.id ?? '',
  );

  const [loadingNotificationId, setLoadingNotificationId] = useState<
    string | null
  >(null);

  const [filter, setFilter] = useState<FilterValue>('all');

  useEffect(() => {
    if (fetchedNotifications) {
      const hrNotifications = fetchedNotifications.filter(n => n.roleId === 2);
      setNotifications(hrNotifications);
    }
  }, [fetchedNotifications, setNotifications]);

  const handleMarkAsReadClick = async (id: string) => {
    setLoadingNotificationId(id);
    await handleMarkAsRead(id);
    setLoadingNotificationId(null);
  };

  const handleAllReadClick = async () => {
    setIsMarkingAllAsRead(true);
    await handleAllMarkAsRead(storeNotifications);
    setIsMarkingAllAsRead(false);
  };

  const filteredNotifications = useMemo(() => {
    return storeNotifications.filter(notification => {
      if (filter === 'all') return true;
      if (filter === 'read') return notification.isRead;
      if (filter === 'unread') return !notification.isRead;
    });
  }, [storeNotifications, filter]);

  const sortedFilteredNotifications = useMemo(() => {
    return [...filteredNotifications].sort(
      (a, b) => (a.isRead ? 1 : 0) - (b.isRead ? 1 : 0),
    );
  }, [filteredNotifications]);

  const readCount = storeNotifications.filter(n => n.isRead).length || 0;
  const unreadCount = storeNotifications.filter(n => !n.isRead).length || 0;

  const getTitle = () => {
    switch (filter) {
      case 'read':
        return 'Read Notifications';
      case 'unread':
        return 'Unread Notifications';
      default:
        return 'All Notifications';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LayoutWrapper className="flex h-screen items-center justify-center">
          <Loader className="animate-spin" />
        </LayoutWrapper>
      </Layout>
    );
  }

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="All Notifications">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>

      <LayoutWrapper className="flex flex-col gap-4">
        <Header subheading="You’ve got new updates! Take a quick look to stay informed."></Header>
        <div className="grid grid-cols-1 gap-12 py-4 md:grid-cols-12 md:py-2">
          <Tabs
            value={filter}
            onValueChange={value => setFilter(value as FilterValue)}
            className="col-span-3"
          >
            <TabsList className="flex w-full justify-between bg-transparent p-0 md:flex-col md:space-y-4">
              {[
                {
                  value: 'all',
                  icon: BadgeCheck,
                  count: storeNotifications.length,
                },
                { value: 'read', icon: Eye, count: readCount },
                { value: 'unread', icon: Mail, count: unreadCount },
              ].map(({ value, icon: Icon, count }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex-1 p-3 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                >
                  <Icon className="mr-2 size-4" />
                  <span className="capitalize">{value}</span>
                  <span className="ml-1">({count})</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="col-span-9">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="mb-0 text-lg font-bold">{getTitle()}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center">
                  <MoreHorizontal className="size-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="absolute -left-0 min-w-[150px] -translate-x-full">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAllReadClick}>
                    <CheckCircle className="mr-2 size-4" />
                    Mark all as read
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <hr className="mb-3" />

            <ul className="w-full space-y-2 overflow-hidden">
              <div className="flex h-[calc(100vh-210px)] flex-col gap-1 overflow-y-auto">
                {isMarkingAllAsRead && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
                    <Loader className="mr-2 animate-spin" />
                  </div>
                )}
                {sortedFilteredNotifications.length > 0 ? (
                  sortedFilteredNotifications.map(notification => (
                    <li key={notification._id} className="relative">
                      {loadingNotificationId === notification._id && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
                          <Loader className="mr-2 animate-spin" />
                        </div>
                      )}

                      <Card className="w-full overflow-hidden">
                        <CardContent className="flex items-center px-3 py-2">
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
                            <p className="break-words text-sm">
                              <span className="font-bold capitalize">
                                {notification.senderId?.firstName || ''}{' '}
                                {notification.senderId?.lastName || ''}
                              </span>{' '}
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex w-10 items-center justify-end">
                            <p className="mr-1 text-xs text-gray-500">
                              {timeAgo(notification.createdAt)}
                            </p>
                            {!notification.isRead && (
                              <span
                                className="cursor-pointer text-lg text-blue-500"
                                onClick={() =>
                                  handleMarkAsReadClick(notification._id)
                                }
                              >
                                ●
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  ))
                ) : (
                  <div className="flex items-center justify-start p-4 text-gray-500">
                    <BellOff className="mr-3 size-5 text-gray-400" />
                    <p className="text-sm font-medium">
                      No notifications available
                    </p>
                  </div>
                )}
              </div>
            </ul>
          </div>
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default AllNotifications;
