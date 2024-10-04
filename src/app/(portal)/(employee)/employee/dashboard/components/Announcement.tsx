'use client';
import { useEffect, useState } from 'react';

import { Megaphone } from 'lucide-react';

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

import { useRecentAnnouncements } from '@/hooks/employee/useRecentAnnouncement';

import { RecentAnnouncement } from '@/types/announcement.types';

const RecentAnnouncements = () => {
  const {
    data: announcements,
    isLoading,
    isFetching,
  } = useRecentAnnouncements();
  const [, setSelectedAnnouncement] = useState<RecentAnnouncement | null>(null);

  useEffect(() => {}, [announcements]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const announcementArray: RecentAnnouncement[] = Array.isArray(announcements)
    ? announcements.filter(announcement => announcement !== undefined)
    : [announcements].filter(announcement => announcement !== undefined);

  const getIconAndColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          icon: <Megaphone className="size-6 text-red-500" />,
          color: 'text-red-500',
        };
      case 'Medium':
        return {
          icon: <Megaphone className="size-6 text-blue-500" />,
          color: 'text-blue-500',
        };
      case 'Low':
      default:
        return {
          icon: <Megaphone className="size-6 text-green-500" />,
          color: 'text-green-500',
        };
    }
  };

  return (
    <Card className="flex h-full flex-col dark:bg-zinc-900">
      <CardHeader className="pb-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold dark:text-white">
            Announcements
          </h2>
          <Badge variant="outline">
            {isLoading || isFetching ? '0' : announcementArray.length || '0'}{' '}
            Recent
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="max-h-[300px] flex-1 overflow-y-auto">
        <div className="space-y-4 overflow-y-auto">
          {isLoading || isFetching ? (
            <div className="text-sm text-gray-500 dark:text-gray-300">
              Loading Announcements
            </div>
          ) : announcementArray?.length <= 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-300">
              No Announcements
            </div>
          ) : (
            announcementArray.map(
              (announcement: RecentAnnouncement, index: number) => {
                const { icon } = getIconAndColor(
                  announcement.Priority || 'normal',
                );
                return (
                  <div
                    key={index}
                    className="flex max-h-[300px] items-start space-x-4 py-2"
                  >
                    {icon}
                    <div>
                      <h3 className="text-sm font-semibold dark:text-white">
                        {announcement.title || 'No Title'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {announcement.Description || 'No Description'}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="link"
                            onClick={() =>
                              setSelectedAnnouncement(announcement)
                            }
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-lg p-6 shadow-lg dark:bg-zinc-900 dark:text-white">
                          <DialogHeader>
                            <DialogTitle className="mb-4 text-2xl font-bold">
                              {announcement.title || 'No Title'}
                            </DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold dark:text-white">
                                  Priority:
                                </span>
                                <span className="text-lg dark:text-gray-300">
                                  {announcement.Priority}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold dark:text-white">
                                  Start Date:
                                </span>
                                <span className="text-lg dark:text-gray-300">
                                  {new Date(
                                    announcement.StartDate,
                                  ).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold dark:text-white">
                                  End Date:
                                </span>
                                <span className="text-lg dark:text-gray-300">
                                  {new Date(
                                    announcement.EndDate,
                                  ).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
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
                                  {announcement.Description}
                                </span>
                              </div>
                            </div>
                          </DialogDescription>
                          <DialogClose />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                );
              },
            )
          )}
        </div>
        {!isLoading && !isFetching && announcementArray?.length > 0 && (
          <div className="mt-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="w-full text-primary dark:bg-gray-600 dark:text-white"
                  onClick={() => setIsDialogOpen(true)}
                >
                  View All Announcements
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-lg p-6 shadow-lg dark:bg-zinc-900 dark:text-white">
                <DialogHeader>
                  <DialogTitle className="mb-4 text-2xl font-bold">
                    All Recent Announcements
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <div className="max-h-96 space-y-4 overflow-y-auto">
                    {announcementArray.length === 0 ? (
                      <div className="py-6 text-gray-700 dark:text-gray-300">
                        No recent announcements.
                      </div>
                    ) : (
                      announcementArray.map((announcement, index) => (
                        <div
                          key={index}
                          className="rounded-md bg-gray-100 p-4 shadow-md dark:bg-zinc-800"
                        >
                          <div className="flex items-center space-x-4">
                            {
                              getIconAndColor(announcement.Priority || 'normal')
                                .icon
                            }
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {announcement.title || 'No Title'}
                            </h3>
                          </div>
                          <div className="mt-4 space-y-2">
                            <p className="text-base dark:text-gray-300">
                              <span className="font-semibold dark:text-white">
                                Priority:
                              </span>{' '}
                              {announcement.Priority}
                            </p>
                            <p className="text-base dark:text-gray-300">
                              <span className="font-semibold dark:text-white">
                                Start Date:
                              </span>{' '}
                              {new Date(
                                announcement.StartDate,
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            <p className="text-base dark:text-gray-300">
                              <span className="font-semibold dark:text-white">
                                End Date:
                              </span>{' '}
                              {new Date(
                                announcement.EndDate,
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
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
                                {announcement.Description}
                              </span>
                            </div>
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

export default RecentAnnouncements;
