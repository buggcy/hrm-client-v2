import React from 'react';

import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface NotificationIconProps {
  unreadCount: number;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({
  unreadCount,
}) => (
  <Button
    variant="outline"
    size="icon"
    aria-label={`Notifications (${unreadCount} unread)`}
    className="relative flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 p-1"
  >
    <Bell className="size-5" />
    {unreadCount > 0 && (
      <span className="absolute right-1 top-1 inline-flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-bold leading-none text-white">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
  </Button>
);
