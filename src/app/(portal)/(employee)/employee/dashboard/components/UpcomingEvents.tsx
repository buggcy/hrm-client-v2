'use client';

import { useState } from 'react';

import { Briefcase, Building } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useWeeklyEvents } from '@/hooks/employee/useEventData';
import { useWeeklyBirthdays } from '@/hooks/employee/useUpcomingBirthdays.hook';

import { EventDialog } from './EventDialog';

import { Birthday } from '@/types/Birthday.types';
import { EventData } from '@/types/events.types';

export type CombinedData = EventData | Birthday;

const EventsAndBirthdays = () => {
  const {
    data: weeklyEvents,
    isLoading: isLoadingEvents,
    isFetching: isFetchingEvents,
  } = useWeeklyEvents();
  const {
    data: weeklyBirthdays,
    isLoading: isLoadingBirthdays,
    error: birthdayError,
  } = useWeeklyBirthdays();

  const events = isLoadingEvents || isFetchingEvents ? [] : weeklyEvents || [];
  const upcomingBirthdays =
    isLoadingBirthdays || birthdayError ? [] : weeklyBirthdays?.data || [];

  const combinedData = [...upcomingBirthdays, ...events].sort((a, b) => {
    const dateA = (a as Birthday).DOB
      ? new Date((a as Birthday).DOB)
      : new Date((a as EventData).start);
    const dateB = (b as Birthday).DOB
      ? new Date((b as Birthday).DOB)
      : new Date((b as EventData).start);
    return dateA.getTime() - dateB.getTime();
  });

  const getEventIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'holiday':
        return (
          <Briefcase className="size-6 min-h-6 min-w-6 text-blue-500 dark:text-blue-300" />
        );
      case 'company':
        return (
          <Building className="size-6 min-h-6 min-w-6 text-blue-500 dark:text-blue-300" />
        );
      default:
        return (
          <Briefcase className="size-6 min-h-6 min-w-6 text-gray-500 dark:text-gray-300" />
        );
    }
  };

  const [selectedEvent, setSelectedEvent] = useState<EventData | undefined>();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const handleViewDialogOpen = (event: EventData) => {
    setSelectedEvent(event);
    setIsViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setIsViewDialogOpen(false);
  };

  return (
    <Card className="h-[428px] dark:bg-zinc-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold dark:text-white">Events</h2>
          <Badge variant="outline">
            {combinedData?.length || '0'} Upcoming
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[307px] space-y-4">
          <ScrollArea className="h-[300px] w-full">
            {combinedData?.length === 0 ? (
              <div className="mt-32 text-center text-sm text-gray-500 dark:text-gray-300">
                No upcoming birthdays or events.
              </div>
            ) : (
              combinedData.map((item: CombinedData, index) => (
                <div
                  key={index}
                  className="mb-2 flex items-start space-x-4 rounded-md"
                >
                  {'DOB' in item ? (
                    <Button
                      variant="outline"
                      className="pointer-events-none flex size-full flex-row items-center justify-start gap-2 px-2"
                    >
                      <Avatar className="size-6">
                        {item.Avatar ? (
                          <img
                            src={item.Avatar}
                            alt={`${item.firstName} ${item.lastName}`}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex size-6 items-center justify-center rounded-full bg-blue-400 text-white">
                            {item.firstName[0]}
                            {item.lastName[0]}
                          </div>
                        )}
                      </Avatar>
                      <div className="flex w-full flex-col items-start">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.firstName} {item.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          {new Date(item.DOB).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                          })}
                        </p>
                      </div>
                      <Badge variant="warning" className="text-xs">
                        Birthday
                      </Badge>
                    </Button>
                  ) : (
                    // Render Event
                    <Button
                      variant="outline"
                      className="flex size-full flex-row items-center justify-start gap-2 px-2"
                      onClick={() => handleViewDialogOpen(item)}
                    >
                      {getEventIcon(item.type)}
                      <div className="flex w-full flex-col items-start">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.title || 'No Title'}
                        </h3>
                        <p className="text-nowrap text-xs text-muted-foreground">
                          {new Date(item.start).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="hidden sm:flex">
                        <Badge
                          variant={
                            item.type === 'company' ? 'progress' : 'success'
                          }
                          className="text-xs"
                        >
                          {item.type}
                        </Badge>
                      </div>
                    </Button>
                  )}
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      </CardContent>
      <EventDialog
        event={selectedEvent}
        open={isViewDialogOpen}
        onOpenChange={handleViewDialogClose}
        onCloseChange={handleViewDialogClose}
      />
    </Card>
  );
};

export default EventsAndBirthdays;
