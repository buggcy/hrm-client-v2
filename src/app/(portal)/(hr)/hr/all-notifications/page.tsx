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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useNotificationsHR } from '@/hooks/useNotification/useNotification';
import useNotificationActions from '@/hooks/useNotification/useNotificationActions';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { timeAgo } from '@/utils/notification.utills';

type FilterValue = 'all' | 'read' | 'unread';

const AllNotifications: FunctionComponent = () => {
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const { notifications: storeNotifications, setNotifications } =
    useNotificationStore();
  const { handleMarkAsRead, handleAllMarkAsRead } = useNotificationActions();
  const { data: fetchedNotifications, isLoading } = useNotificationsHR();

  const [loadingNotificationId, setLoadingNotificationId] = useState<
    string | null
  >(null);
  const [filter, setFilter] = useState<FilterValue>('all');

  useEffect(() => {
    if (fetchedNotifications) {
      const hrNotifications = fetchedNotifications.filter(n => n.roleId === 1);
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

      <LayoutWrapper className="flex flex-col gap-4 sm:flex-row sm:gap-12">
        <div className="w-full sm:w-1/4">
          <Tabs
            value={filter}
            onValueChange={value => setFilter(value as FilterValue)}
            className="w-full"
          >
            <TabsList className="mt-4 flex w-full justify-between bg-transparent p-0 sm:flex-col sm:space-y-4">
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
        </div>

        <div className="w-full min-w-80 p-6 sm:w-8/12">
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
          <ScrollArea
            className="overflow-y-auto"
            style={{
              height: 'calc(100vh - 230px)',
            }}
          >
            {isMarkingAllAsRead && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
                <Loader className="mr-2 animate-spin" />
              </div>
            )}
            <ul className="space-y-2">
              {sortedFilteredNotifications.length > 0 ? (
                sortedFilteredNotifications.map(notification => (
                  <li key={notification._id} className="relative">
                    {loadingNotificationId === notification._id && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
                        <Loader className="mr-2 animate-spin" />
                      </div>
                    )}

                    <Card>
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
                          <p className="text-sm">
                            <span className="font-bold capitalize">
                              {notification.senderId?.firstName ||
                                'Unknown First Name'}{' '}
                              {notification.senderId?.lastName ||
                                'Unknown Last Name'}
                            </span>{' '}
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <p className="mr-2 text-xs text-gray-500">
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
            </ul>
          </ScrollArea>
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default AllNotifications;
