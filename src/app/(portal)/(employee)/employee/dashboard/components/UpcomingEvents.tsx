'use client';
import { useEffect, useState } from 'react';

import { Briefcase, Building } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

import { EventData } from '@/types/events.types';

const UpcomingEvents = () => {
  const { data: eventsData, isLoading, isFetching } = useEventsData();
  useEffect(() => {}, [eventsData]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setSelectedEvent] = useState<EventData | null>(null);
  const events = isLoading || isFetching ? [] : eventsData || [];

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
    <Card className="mb-2 px-6 py-9 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold dark:text-white">
          Upcoming Events
        </h2>
        <button className="rounded-xl border-red-100 bg-primary px-3 py-1 text-sm text-white">
          {events.length || '0'} Upcoming
        </button>
      </div>

      <div className="max-h-28 space-y-4 overflow-y-auto">
        <hr className="border-gray-200 p-2 dark:border-gray-700" />
        {isLoading || isFetching ? (
          <div className="flex items-start space-x-4">
            <div>
              <h3 className="ml-2 text-sm font-semibold text-gray-900 dark:text-gray-300">
                No Recent Events
              </h3>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-300">
            No upcoming events.
          </div>
        ) : (
          events.map((event: EventData, index) => (
            <div key={index} className="flex items-start space-x-4">
              {getEventIcon(event.type)}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {event.title || 'No Title'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {event.type || 'No Type'}
                </p>
                <Dialog>
                  <DialogTrigger>
                    <Button
                      className="text-left"
                      variant="link"
                      onClick={() => handleEventClick(event)}
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
                            <span className="justify-center text-sm font-semibold dark:text-white">
                              Title:
                            </span>
                            <span className="justify-center text-sm dark:text-gray-300">
                              {event.title}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="justify-center text-sm font-semibold dark:text-white">
                              Description:
                            </span>
                            <span className="justify-center text-sm dark:text-gray-300">
                              {event.Event_Discription}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold dark:text-white">
                              Start Date:
                            </span>
                            <span className="dark:text-gray-300">
                              {new Date(event.start).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold dark:text-white">
                              End Date:
                            </span>
                            <span className="dark:text-gray-300">
                              {new Date(event.end).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogClose />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className="w-full bg-blue-100 text-primary dark:bg-gray-600 dark:text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              View All Events
            </Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-zinc-900 dark:text-white">
            <DialogHeader>
              <DialogTitle className="dark:text-white">
                All Upcoming Events
              </DialogTitle>
              <DialogDescription className="dark:text-gray-300">
                <div className="space-y-4">
                  {isLoading || isFetching ? (
                    <div className="flex items-start space-x-4">
                      <div>
                        <h3 className="ml-2 text-sm font-semibold text-gray-900 dark:text-gray-300">
                          No Recent Events
                        </h3>
                      </div>
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-300">
                      No upcoming events.
                    </div>
                  ) : (
                    events.map((event, index) => (
                      <div
                        key={index}
                        className="rounded-md bg-white p-4 shadow-md dark:bg-zinc-900"
                      >
                        <div className="flex items-center space-x-4">
                          {getEventIcon(event.type)}
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {event.title || 'No Title'}
                          </h3>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            {event.type || 'No Type'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            {Intl.DateTimeFormat('en-US', {
                              dateStyle: 'full',
                              timeStyle: 'short',
                            }).format(new Date(event.start))}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogClose />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default UpcomingEvents;
