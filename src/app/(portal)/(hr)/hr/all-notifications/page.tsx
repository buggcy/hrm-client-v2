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

interface FilterMenuItemProps {
  value: FilterValue;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

  const FilterMenuItem: React.FC<FilterMenuItemProps> = ({
    value,
    icon: Icon,
    count,
  }) => (
    <DropdownMenuItem onClick={() => setFilter(value)}>
      <Icon className="mr-2 size-4" />
      <span className="mr-1 capitalize">{value}</span> ({count})
    </DropdownMenuItem>
  );

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="All Notifications">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>

      <LayoutWrapper className="flex flex-col gap-12 sm:flex-row">
        <div className={`mt-20 w-1/4 ${isMobile ? 'hidden' : ''}`}>
          <Tabs
            value={filter}
            onValueChange={value => setFilter(value as FilterValue)}
          >
            <TabsList className="flex min-w-48 flex-col space-y-2 bg-transparent p-4">
              {['all', 'read', 'unread'].map(tabValue => (
                <div
                  key={tabValue}
                  style={{ width: '100%' }}
                  className="rounded-md"
                >
                  <TabsTrigger
                    value={tabValue}
                    className={`flex w-full items-center justify-center rounded-md py-3 data-[state=active]:bg-gray-200 data-[state=active]:text-black ${
                      filter === tabValue && 'bg-gray-300 text-black'
                    }`}
                  >
                    {tabValue === 'all' && (
                      <BadgeCheck className="mr-2 text-gray-500" size={17} />
                    )}
                    {tabValue === 'read' && (
                      <Eye className="mr-2 text-gray-500" size={17} />
                    )}
                    {tabValue === 'unread' && (
                      <Mail className="mr-2 text-gray-500" size={17} />
                    )}
                    <span
                      className={
                        tabValue === 'all'
                          ? 'pr-5'
                          : tabValue === 'read'
                            ? 'pr-2'
                            : ''
                      }
                    >
                      {tabValue.charAt(0).toUpperCase() + tabValue.slice(1)} (
                      {tabValue === 'all'
                        ? storeNotifications.length
                        : tabValue === 'read'
                          ? readCount
                          : unreadCount}
                      )
                    </span>
                  </TabsTrigger>
                </div>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className={`${isMobile ? 'w-full' : 'w-8/12'} min-w-80 p-6`}>
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
                {isMobile && (
                  <>
                    <FilterMenuItem
                      value="all"
                      icon={BadgeCheck}
                      count={storeNotifications.length}
                    />
                    <FilterMenuItem value="read" icon={Eye} count={readCount} />
                    <FilterMenuItem
                      value="unread"
                      icon={Mail}
                      count={unreadCount}
                    />
                  </>
                )}
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
