'use client';

import { useState } from 'react';

import { Briefcase, Building } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useEventsData } from '@/hooks/employee/useEventData';
import { useUpcomingBirthdays } from '@/hooks/employee/useUpcomingBirthdays.hook';

import { Birthday } from '@/types/Birthday.types';
import { EventData } from '@/types/events.types';

type CombinedData = EventData | Birthday;

const EventsAndBirthdays = () => {
  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    isFetching: isFetchingEvents,
  } = useEventsData();
  const {
    data: birthdayData,
    isLoading: isLoadingBirthdays,
    error: birthdayError,
  } = useUpcomingBirthdays();

  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setSelectedEvent] = useState<EventData | null>(null);

  const events = isLoadingEvents || isFetchingEvents ? [] : eventsData || [];
  const upcomingBirthdays =
    isLoadingBirthdays || birthdayError ? [] : birthdayData?.data || [];

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
          <Briefcase className="size-6 text-blue-500 dark:text-blue-300" />
        );
      case 'company':
        return <Building className="size-6 text-blue-500 dark:text-blue-300" />;
      default:
        return (
          <Briefcase className="size-6 text-gray-500 dark:text-gray-300" />
        );
    }
  };

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event);
  };

  return (
    <Card className="h-full dark:bg-zinc-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold dark:text-white">
            Birthdays & Events
          </h2>
          <Badge variant="outline">{combinedData.length || '0'} Upcoming</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[307px] space-y-4 overflow-y-auto">
          {combinedData.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-300">
              No upcoming birthdays or events.
            </div>
          ) : (
            combinedData.map((item: CombinedData, index) => (
              <div key={index} className="flex items-start space-x-4">
                {'DOB' in item ? (
                  // Render Birthday
                  <>
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
                    <div className="-ml-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.firstName} {item.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {new Date(item.DOB).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    </div>
                  </>
                ) : (
                  // Render Event
                  <>
                    {getEventIcon(item.type)}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.title || 'No Title'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {item.type || 'No Type'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {new Date(item.start).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </p>
                      <Dialog>
                        <DialogTrigger>
                          <Button
                            className="text-left"
                            variant="link"
                            onClick={() => handleEventClick(item)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="dark:text-white">
                          <DialogHeader>
                            <DialogTitle className="dark:text-white">
                              Event Details
                            </DialogTitle>
                            <DialogDescription className="dark:text-gray-300">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm font-semibold dark:text-white">
                                    Title:
                                  </span>
                                  <span className="text-sm dark:text-gray-300">
                                    {item.title}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm font-semibold dark:text-white">
                                    Description:
                                  </span>
                                  <span className="text-sm dark:text-gray-300">
                                    {item.Event_Discription}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold dark:text-white">
                                    Start Date:
                                  </span>
                                  <span className="dark:text-gray-300">
                                    {new Date(item.start).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold dark:text-white">
                                    End Date:
                                  </span>
                                  <span className="dark:text-gray-300">
                                    {new Date(item.end).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                          <DialogClose />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsAndBirthdays;
