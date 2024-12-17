'use client';

import { useState } from 'react';

import {
  BookImage,
  Briefcase,
  Building,
  Calendar,
  Eye,
  Tag,
} from 'lucide-react';

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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useWeeklyEvents } from '@/hooks/employee/useEventData';
import { useWeeklyBirthdays } from '@/hooks/employee/useUpcomingBirthdays.hook';

import { Birthday } from '@/types/Birthday.types';
import { EventData } from '@/types/events.types';

type CombinedData = EventData | Birthday;

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

  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setSelectedEvent] = useState<EventData | null>(null);

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
  const formatDate = (dateInput?: string | Date): string => {
    if (!dateInput) return 'Invalid date';

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
          <Badge variant="outline">
            {combinedData?.length || '0'} Upcoming
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[307px] space-y-4">
          <ScrollArea className="h-[300px] w-full">
            {combinedData?.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-300">
                No upcoming birthdays or events.
              </div>
            ) : (
              combinedData.map((item: CombinedData, index) => (
                <div
                  key={index}
                  className="mb-2 flex items-start space-x-4 rounded-md border p-2"
                >
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
                      <div className="group relative w-full">
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
                          <DialogTrigger className="absolute right-0 top-0 hidden group-hover:flex">
                            <Button
                              variant="link"
                              onClick={() => handleEventClick(item)}
                            >
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span>
                                      <Eye
                                        className="ml-2 inline cursor-pointer text-primary/80 hover:text-primary"
                                        size={18}
                                      />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>View Details</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="flex max-h-[550px] flex-col p-6 max-sm:max-h-[600px] sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle className="dark:text-white">
                                Event Details
                              </DialogTitle>
                              <DialogDescription className="dark:text-gray-300">
                                <div className="flex flex-col gap-3">
                                  <div className="flex h-fit justify-between">
                                    <div className="grid h-fit w-full gap-4 pt-4 text-left">
                                      <div className="grid h-fit w-full grid-cols-1 max-sm:gap-3 sm:grid-cols-2">
                                        <div className="flex space-x-3 max-sm:justify-between">
                                          <div className="flex gap-3">
                                            <BookImage className="size-4 text-blue-500" />
                                            <span className="text-sm font-medium text-black dark:text-white">
                                              Event Name:
                                            </span>
                                          </div>
                                          <p className="text-sm">
                                            {item.title || ''}
                                          </p>
                                        </div>
                                        <div className="flex space-x-3 max-sm:justify-between">
                                          <div className="flex gap-3">
                                            <Tag className="size-4 text-blue-500" />
                                            <span className="text-sm font-medium text-black dark:text-white">
                                              Type:
                                            </span>
                                          </div>
                                          <p className="text-sm">
                                            {item.type === 'company'
                                              ? 'Non Holiday'
                                              : 'Holiday'}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="grid h-fit grid-cols-1 max-sm:gap-3 sm:grid-cols-2">
                                        <div className="flex space-x-3 max-sm:justify-between">
                                          <div className="flex gap-3">
                                            <Calendar className="size-4 text-blue-500" />
                                            <span className="text-sm font-medium text-black dark:text-white">
                                              Start Date:
                                            </span>
                                          </div>
                                          <p className="text-sm">
                                            {formatDate(item?.start)}
                                          </p>
                                        </div>
                                        <div className="flex space-x-3 max-sm:justify-between">
                                          <div className="flex gap-3">
                                            <Calendar className="size-4 text-blue-500" />
                                            <span className="text-sm font-medium text-black dark:text-white">
                                              End Date:
                                            </span>
                                          </div>
                                          <p className="text-sm">
                                            {formatDate(item?.end)}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex flex-col space-y-3">
                                        <span className="text-sm font-medium text-black dark:text-white">
                                          Description:
                                        </span>
                                        <div className="description-content max-h-60 overflow-y-auto px-8 text-sm">
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                item.Event_Discription || '',
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
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
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsAndBirthdays;
