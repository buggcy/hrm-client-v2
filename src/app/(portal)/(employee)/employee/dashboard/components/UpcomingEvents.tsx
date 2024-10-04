'use client';

import { useState } from 'react';

import { Briefcase, Building, Gift } from 'lucide-react';

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

// Fixing the types for merged data to support both Birthday and Event types
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setSelectedEvent] = useState<EventData | null>(null);

  const events = isLoadingEvents || isFetchingEvents ? [] : eventsData || [];
  const upcomingBirthdays =
    isLoadingBirthdays || birthdayError ? [] : birthdayData?.data || [];

  // Merge and sort the events and birthdays by date
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
    <Card className="flex h-full flex-col dark:bg-zinc-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold dark:text-white">
            Birthdays & Events
          </h2>
          <Badge variant="outline">{combinedData.length || '0'} Upcoming</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div
          className={`space-y-4 ${
            combinedData.length > 3 ? 'max-h-[205px] overflow-y-auto' : ''
          }`}
        >
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
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {item.daysUntilBirthday} days left
                      </span>
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
                        <DialogContent className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900 dark:text-white">
                          <DialogHeader>
                            <DialogTitle className="mb-4 text-2xl font-bold dark:text-white">
                              Event Details
                            </DialogTitle>
                          </DialogHeader>
                          <DialogDescription className="dark:text-gray-300">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold dark:text-white">
                                  Title:
                                </span>
                                <span className="text-lg dark:text-gray-300">
                                  {item.title}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold dark:text-white">
                                  Start Date:
                                </span>
                                <span className="text-lg dark:text-gray-300">
                                  {new Date(item.end).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold dark:text-white">
                                  End Date:
                                </span>
                                <span className="text-lg dark:text-gray-300">
                                  {new Date(item.end).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="mt-4 flex flex-col">
                                <span className="text-lg font-semibold dark:text-white">
                                  Description:
                                </span>
                                <span
                                  className="mt-2 text-base dark:text-gray-300"
                                  style={{
                                    fontWeight: 'normal',
                                    fontSize: '1.1rem',
                                  }}
                                >
                                  {item.Event_Discription}
                                </span>
                              </div>
                            </div>
                          </DialogDescription>
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
        {combinedData?.length > 0 && (
          <div className="mt-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="w-full bg-blue-100 text-primary dark:bg-gray-600 dark:text-white"
                  onClick={() => setIsDialogOpen(true)}
                >
                  View All Events & Birthdays
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-lg p-6 shadow-lg dark:bg-zinc-900 dark:text-white">
                <DialogHeader>
                  <DialogTitle className="mb-4 text-2xl font-bold">
                    All Upcoming Birthdays & Events
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <div className="max-h-96 space-y-4 overflow-y-auto">
                    {combinedData.length === 0 ? (
                      <div className="py-6 text-gray-700 dark:text-gray-300">
                        No upcoming events.
                      </div>
                    ) : (
                      combinedData.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-md bg-gray-100 p-4 shadow-md dark:bg-zinc-800"
                        >
                          <div className="flex items-center space-x-4">
                            {'DOB' in item ? (
                              <Gift className="size-6 text-blue-500 dark:text-blue-300" />
                            ) : (
                              getEventIcon(item.type)
                            )}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {'DOB' in item
                                ? `${item.firstName} ${item.lastName}`
                                : item.title || 'No Title'}
                            </h3>
                          </div>
                          <div className="mt-4 space-y-2">
                            <p className="text-base dark:text-gray-300">
                              <span className="font-semibold dark:text-white">
                                {'DOB' in item ? 'Birthday' : 'Type'}
                              </span>
                              :{' '}
                              {'DOB' in item
                                ? new Date(item.DOB).toLocaleDateString(
                                    'en-US',
                                    {
                                      day: 'numeric',
                                      month: 'long',
                                    },
                                  )
                                : item.type || 'No Type'}
                            </p>
                            {'start' in item && (
                              <p className="text-base dark:text-gray-300">
                                <span className="font-semibold dark:text-white">
                                  Date:
                                </span>
                                {Intl.DateTimeFormat('en-US', {
                                  dateStyle: 'full',
                                  timeStyle: 'short',
                                }).format(new Date(item.start))}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DialogDescription>
                <DialogClose />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsAndBirthdays;
