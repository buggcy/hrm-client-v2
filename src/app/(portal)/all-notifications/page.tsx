'use client';
import React, { FunctionComponent, useMemo, useState } from 'react';

import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon/NotificationIcon';

import useNotificationActions from '@/hooks/useNotification/useNotificationActions';
import { useNotificationStore } from '@/stores/useNotificationStore';

import { NotificationFilter } from '../all-notifications/components/NotificationFilter';
import { NotificationHeader } from '../all-notifications/components/NotificationHeader';
import { NotificationList } from '../all-notifications/components/NotificationList';

const AllNotifications: FunctionComponent = () => {
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const { notifications: storeNotifications } = useNotificationStore();
  const { handleMarkAsRead, handleAllMarkAsRead } = useNotificationActions();
  const [loadingNotificationId, setLoadingNotificationId] = useState<
    string | null
  >(null);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

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

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="All Notifications">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>

      <LayoutWrapper className="flex flex-col gap-4">
        <Header subheading="You've got new updates! Take a quick look to stay informed." />
        <div className="grid grid-cols-1 gap-12 py-4 md:grid-cols-12 md:py-2">
          <NotificationFilter
            filter={filter}
            setFilter={setFilter}
            counts={{
              all: storeNotifications.length,
              read: readCount,
              unread: unreadCount,
            }}
          />
          <div className="col-span-9">
            <NotificationHeader
              title={getTitle()}
              handleAllReadClick={handleAllReadClick}
            />
            <hr className="mb-3" />
            <NotificationList
              notifications={sortedFilteredNotifications}
              loadingNotificationId={loadingNotificationId}
              handleMarkAsReadClick={handleMarkAsReadClick}
              isMarkingAllAsRead={isMarkingAllAsRead}
            />
          </div>
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default AllNotifications;
