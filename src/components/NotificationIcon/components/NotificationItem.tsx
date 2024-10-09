import React from 'react';

import { Loader } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { timeAgo } from '@/utils/notification.utills';

import { Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
  loadingNotificationId: string | null;
  handleMarkAsReadClick: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  loadingNotificationId,
  handleMarkAsReadClick,
}) => (
  <DropdownMenuItem
    onClick={e => e.preventDefault()}
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
);
