import React from 'react';

import { BellOff, Loader } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';

import { NotificationItem } from './NotificationItem';
import { Notification } from '../types';

interface NotificationListProps {
  sortedNotifications: Notification[];
  isMarkingAllAsRead: boolean;
  loadingNotificationId: string | null;
  handleMarkAsReadClick: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  sortedNotifications,
  isMarkingAllAsRead,
  loadingNotificationId,
  handleMarkAsReadClick,
}) => (
  <ScrollArea className="h-72 min-w-[350px] md:min-w-[500px]">
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
        <NotificationItem
          key={notification._id}
          notification={notification}
          loadingNotificationId={loadingNotificationId}
          handleMarkAsReadClick={handleMarkAsReadClick}
        />
      ))
    )}
  </ScrollArea>
);
