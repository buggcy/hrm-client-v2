import React from 'react';

import { CheckCircle, MoreHorizontal } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NotificationHeaderProps {
  unreadCount: number;
  handleMarkAllAsRead: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  handleMarkAllAsRead,
}) => (
  <div className="flex items-center justify-between p-2">
    <h1 className="font-bold">Notifications</h1>
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-md p-1 hover:bg-gray-200">
            <MoreHorizontal size={24} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-max -translate-x-18">
          <div className="mr-1 flex items-center justify-between">
            <DropdownMenuLabel>Activity Feed</DropdownMenuLabel>
            <span className="text-sm text-gray-500">
              <span className="ml-2 flex size-7 items-center justify-center rounded-full bg-muted">
                {unreadCount}
              </span>
            </span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex w-full cursor-pointer items-center p-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-blue-500"
            onClick={handleMarkAllAsRead}
          >
            <CheckCircle className="mr-2 size-4" />
            Mark all as read
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);
