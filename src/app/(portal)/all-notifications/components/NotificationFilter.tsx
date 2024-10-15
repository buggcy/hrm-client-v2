import React from 'react';

import { BadgeCheck, Eye, Mail } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type FilterValue = 'all' | 'read' | 'unread';

interface NotificationFilterProps {
  filter: FilterValue;
  setFilter: (value: FilterValue) => void;
  counts: {
    all: number;
    read: number;
    unread: number;
  };
}

export const NotificationFilter: React.FC<NotificationFilterProps> = ({
  filter,
  setFilter,
  counts,
}) => (
  <Tabs
    value={filter}
    onValueChange={value => setFilter(value as FilterValue)}
    className="col-span-3"
  >
    <TabsList className="flex w-full justify-between bg-transparent p-0 md:flex-col md:space-y-4">
      {[
        { value: 'all' as const, icon: BadgeCheck, count: counts.all },
        { value: 'read' as const, icon: Eye, count: counts.read },
        { value: 'unread' as const, icon: Mail, count: counts.unread },
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
);
