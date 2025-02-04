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
  title: string;
  handleAllReadClick: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  title,
  handleAllReadClick,
}) => (
  <div className="mb-1 flex items-center justify-between">
    <h2 className="mb-0 text-lg font-bold">{title}</h2>
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center">
        <MoreHorizontal className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute -left-0 min-w-[180px] -translate-x-full">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleAllReadClick}
          className="cursor-pointer"
        >
          <CheckCircle className="mr-2 size-4" />
          Mark all as read
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
