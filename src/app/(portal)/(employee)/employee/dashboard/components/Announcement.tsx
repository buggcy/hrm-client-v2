import { useEffect, useState } from 'react';

import { CheckCircleIcon, Newspaper, Target } from 'lucide-react';

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
          icon: <CheckCircleIcon className="size-6 text-red-500" />,
          color: 'text-red-500',
        };
      case 'Medium':
        return {
          icon: <Newspaper className="size-6 text-blue-500" />,
          color: 'text-blue-500',
        };
      case 'Low':
      default:
        return {
          icon: <Target className="size-6 text-green-500" />,
          color: 'text-green-500',
        };
    }
  };

  return (
    <Card className="mb-2 w-full px-6 py-9 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold dark:text-white">
          Recent Announcements
        </h2>
        <button className="rounded-xl border-red-100 bg-primary px-5 py-1 text-sm text-white">
          {isLoading || isFetching ? '0' : announcementArray.length || '0'}{' '}
          Recent
        </button>
      </div>

      <div className="max-h-20 space-y-4 overflow-y-auto">
        {isLoading || isFetching ? (
          <div className="flex items-start space-x-4">
            <div>
              <h3 className="ml-2 text-sm font-semibold text-gray-900 dark:text-gray-300">
                No Recent Announcements
              </h3>
            </div>
          </div>
        ) : announcementArray.length === 0 ? (
          <div className="text-gray-700 dark:text-gray-300">
            No recent announcements.
          </div>
        ) : (
          announcementArray.map(
            (announcement: RecentAnnouncement, index: number) => {
              const { icon } = getIconAndColor(
                announcement.Priority || 'normal',
              );
              return (
                <div key={index} className="flex items-start space-x-4 py-2">
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
                          onClick={() => setSelectedAnnouncement(announcement)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="dark:bg-zinc-900 dark:text-white">
                        <DialogHeader>
                          <DialogTitle>
                            {announcement.title || 'No Title'}
                          </DialogTitle>
                          <DialogDescription>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="font-semibold dark:text-white">
                                  Description:
                                </span>
                                <span className="dark:text-gray-300">
                                  {announcement.Description}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold dark:text-white">
                                  Priority:
                                </span>
                                <span className="dark:text-gray-300">
                                  {announcement.Priority}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold dark:text-white">
                                  Start Date:
                                </span>
                                <span className="dark:text-gray-300">
                                  {new Date(
                                    announcement.StartDate,
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold dark:text-white">
                                  End Date:
                                </span>
                                <span className="dark:text-gray-300">
                                  {new Date(
                                    announcement.EndDate,
                                  ).toLocaleString()}
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
              );
            },
          )
        )}
      </div>

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
                            getIconAndColor(announcement.Priority || 'normal')
                              .icon
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
                            {new Date(announcement.StartDate).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            End Date:{' '}
                            {new Date(announcement.EndDate).toLocaleString()}
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

export default RecentAnnouncements;
