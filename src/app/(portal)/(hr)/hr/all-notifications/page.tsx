'use client';

import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import {
  BadgeCheck,
  BellOff,
  Eye,
  Loader,
  Mail,
  MoreHorizontal,
  User,
} from 'lucide-react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon/NotificationIcon';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useNotificationsHR } from '@/hooks/useNotification/useNotification';
import useNotificationActions from '@/hooks/useNotification/useNotificationActions';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { timeAgo } from '@/utils/notification.utills';

const AllNotifications: FunctionComponent = () => {
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const { notifications: storeNotifications, setNotifications } =
    useNotificationStore();
  const { handleMarkAsRead, handleAllMarkAsRead } = useNotificationActions();
  const { data: fetchedNotifications, isLoading } = useNotificationsHR();

  const [loadingNotificationId, setLoadingNotificationId] = useState<
    string | null
  >(null);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

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

  const readCount = storeNotifications.filter(n => n.isRead).length;
  const unreadCount = storeNotifications.filter(n => !n.isRead).length;

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

      <LayoutWrapper className="flex gap-12">
        <div className="mt-24 w-1/4">
          <Tabs
            value={filter}
            onValueChange={value =>
              setFilter(value as 'all' | 'read' | 'unread')
            }
          >
            <TabsList className="flex flex-col space-y-2 bg-transparent p-4">
              <Card className="w-full p-0">
                <CardContent className="p-0">
                  <TabsTrigger
                    style={{ width: '100%' }}
                    value="all"
                    className={`flex items-center justify-center rounded-lg py-3 ${
                      filter === 'all'
                        ? 'w-full bg-gray-300 text-black'
                        : 'hover:w-full hover:bg-gray-200'
                    }`}
                  >
                    <BadgeCheck className="mr-2 text-blue-500" size={17} />
                    <span style={{ paddingRight: '1.7rem' }}>
                      All ({storeNotifications.length})
                    </span>
                  </TabsTrigger>
                </CardContent>
              </Card>
              <Card className="w-full p-0">
                <CardContent className="p-0">
                  <TabsTrigger
                    style={{ width: '100%' }}
                    value="read"
                    className={`flex items-center justify-center rounded-lg py-3 ${
                      filter === 'read'
                        ? 'w-full bg-gray-300 text-black'
                        : 'hover:w-full hover:bg-gray-200'
                    }`}
                  >
                    <Eye className="mr-2 text-blue-500" size={17} />
                    <span style={{ paddingRight: '1.3rem' }}>
                      Read ({readCount})
                    </span>
                  </TabsTrigger>
                </CardContent>
              </Card>
              <Card className="w-full p-0">
                <CardContent className="p-0">
                  <TabsTrigger
                    style={{ width: '100%' }}
                    value="unread"
                    className={`flex items-center justify-center rounded-lg py-3 ${
                      filter === 'unread'
                        ? 'w-full bg-gray-300 text-black'
                        : 'hover:w-full hover:bg-gray-200'
                    }`}
                  >
                    <Mail className="mr-2 text-blue-500" size={17} />
                    <span>Unread ({unreadCount})</span>
                  </TabsTrigger>
                </CardContent>
              </Card>
            </TabsList>
          </Tabs>
        </div>

        <div className="w-8/12 p-6">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="mb-0 text-lg font-bold">{getTitle()}</h2>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center">
                <MoreHorizontal className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleAllReadClick}>
                  <BadgeCheck className="mr-2 size-4" />
                  Mark all as read
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <hr className="mb-3" />
          <ScrollArea className="h-96">
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
                        {notification.senderId?.Avatar ? (
                          <img
                            src={notification.senderId.Avatar}
                            alt="Sender Avatar"
                            className="mr-2 size-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="mr-2 flex size-12 items-center justify-center rounded-full bg-gray-300">
                            <User size={24} color="#555" />
                          </div>
                        )}
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
