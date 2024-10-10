import React from 'react';

import { BellOff, Loader } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

import { timeAgo } from '@/utils/notification.utills';

interface Notification {
  _id: string;
  senderId?: {
    Avatar?: string;
    firstName?: string;
    lastName?: string;
  };
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  loadingNotificationId: string | null;
  handleMarkAsReadClick: (id: string) => void;
  isMarkingAllAsRead: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loadingNotificationId,
  handleMarkAsReadClick,
  isMarkingAllAsRead,
}) => (
  <ul className="w-full space-y-2 overflow-hidden">
    <div className="flex h-[calc(100vh-210px)] flex-col gap-1 overflow-y-auto">
      {isMarkingAllAsRead && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
          <Loader className="mr-2 animate-spin" />
        </div>
      )}
      {notifications.length > 0 ? (
        notifications.map(notification => (
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
                      onClick={() => handleMarkAsReadClick(notification._id)}
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
          <p className="text-sm font-medium">No notifications available</p>
        </div>
      )}
    </div>
  </ul>
);
