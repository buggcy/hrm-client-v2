'use client';
import { useEffect, useState } from 'react';

import { CircleArrowDown, CircleArrowRight, CircleArrowUp } from 'lucide-react';

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

import { ViewAnnouncement } from '@/app/(portal)/(hr)/hr/manage-announcements/components/ViewAnnouncementDialog.component';
import { useRecentAnnouncements } from '@/hooks/employee/useRecentAnnouncement';

import { RecentAnnouncement } from '@/types/announcement.types';

const RecentAnnouncements = () => {
  const {
    data: announcements,
    isLoading,
    isFetching,
  } = useRecentAnnouncements();
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<RecentAnnouncement>();

  useEffect(() => {}, [announcements]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const handleViewDialogOpen = (announcement: RecentAnnouncement) => {
    setSelectedAnnouncement(announcement);
    setIsViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setIsViewDialogOpen(false);
  };

  const announcementArray: RecentAnnouncement[] = Array.isArray(announcements)
    ? announcements.filter(announcement => announcement !== undefined)
    : [announcements].filter(announcement => announcement !== undefined);

  const getIconAndColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return {
          icon: <CircleArrowUp className="size-6 min-h-6 min-w-6" />,
          color: 'text-red-600',
        };
      case 'medium':
        return {
          icon: <CircleArrowRight className="size-6 min-h-6 min-w-6" />,
          color: 'text-yellow-500',
        };
      case 'low':
      default:
        return {
          icon: <CircleArrowDown className="size-6 min-h-6 min-w-6" />,
          color: 'text-green-500',
        };
    }
  };

  return (
    <Card className="mb-2 min-h-[400px] w-full dark:bg-zinc-900">
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
      <CardContent>
        <div className="max-h-[300px] space-y-4 overflow-y-auto pr-4">
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
                const formatOptions: Intl.DateTimeFormatOptions = {
                  month: 'short',
                  day: 'numeric',
                };
                const startDate = new Intl.DateTimeFormat(
                  'en-US',
                  formatOptions,
                ).format(new Date(announcement.StartDate));
                const endDate = new Intl.DateTimeFormat(
                  'en-US',
                  formatOptions,
                ).format(new Date(announcement.EndDate));
                return (
                  <Button
                    variant="outline"
                    onClick={() => handleViewDialogOpen(announcement)}
                    key={index}
                    className="flex size-full items-center justify-start space-x-2 rounded-md border p-2"
                  >
                    {icon}
                    <div>
                      <h3 className="text-left text-sm font-semibold dark:text-white">
                        {announcement.title || 'No Title'}
                      </h3>
                      <p className="text-left text-xs text-muted-foreground">
                        {startDate}{' '}
                        {startDate !== endDate ? ` - ${endDate}` : ''}
                      </p>
                    </div>
                  </Button>
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
              <DialogContent className="dark:bg-zinc-900 dark:text-white">
                <DialogHeader>
                  <DialogTitle>All Recent Announcements</DialogTitle>
                  <DialogDescription>
                    <div className="space-y-4">
                      {announcementArray.length === 0 ? (
                        <div className="py-6 text-gray-700 dark:text-gray-300">
                          No recent announcements.
                        </div>
                      ) : (
                        announcementArray.map((announcement, index) => (
                          <div
                            key={index}
                            className="rounded-md bg-white p-4 shadow-md dark:bg-zinc-900"
                          >
                            <div className="flex items-center space-x-4">
                              {
                                getIconAndColor(
                                  announcement.Priority || 'normal',
                                ).icon
                              }
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {announcement.title || 'No Title'}
                              </h3>
                            </div>
                            <div className="mt-4">
                              <p className="text-sm text-gray-500 dark:text-gray-300">
                                Description:{' '}
                                {announcement.Description || 'No Description'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-300">
                                Priority: {announcement.Priority}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-300">
                                Start Date:{' '}
                                {new Date(
                                  announcement.StartDate,
                                ).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-300">
                                End Date:{' '}
                                {new Date(
                                  announcement.EndDate,
                                ).toLocaleString()}
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
        )}
      </CardContent>
      <ViewAnnouncement
        announcement={selectedAnnouncement}
        open={isViewDialogOpen}
        onOpenChange={handleViewDialogClose}
        onCloseChange={handleViewDialogClose}
      />
    </Card>
  );
};

export default RecentAnnouncements;
