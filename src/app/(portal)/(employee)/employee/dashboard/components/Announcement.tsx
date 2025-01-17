'use client';
import { useEffect, useState } from 'react';

import { CircleArrowDown, CircleArrowRight, CircleArrowUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  announcementArray.sort(
    (a, b) => new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime(),
  );
  const getIconAndColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return {
          icon: (
            <CircleArrowUp className="size-6 min-h-6 min-w-6 text-red-600" />
          ),
        };
      case 'medium':
        return {
          icon: (
            <CircleArrowRight className="size-6 min-h-6 min-w-6 text-yellow-500" />
          ),
        };
      case 'low':
      default:
        return {
          icon: (
            <CircleArrowDown className="size-6 min-h-6 min-w-6 text-green-500" />
          ),
        };
    }
  };

  return (
    <Card className="min-h-[400px] w-full dark:bg-zinc-900">
      <CardHeader className="pb-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold dark:text-white">This Week</h2>
          <Badge variant="outline">
            {isLoading || isFetching ? '0' : announcementArray?.length || '0'}{' '}
            Recent
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[300px] space-y-4">
          <ScrollArea className="h-[280px] w-full">
            {isLoading || isFetching ? (
              <div className="mt-32 text-center text-xs text-gray-500 dark:text-gray-300">
                Loading...
              </div>
            ) : announcementArray?.length <= 0 ? (
              <div className="mt-32 text-center text-xs text-gray-500 dark:text-gray-300">
                No Announcements at the moment
              </div>
            ) : (
              announcementArray.map(
                (announcement: RecentAnnouncement, index: number) => {
                  const { icon } = getIconAndColor(
                    announcement?.Priority || 'normal',
                  );

                  return (
                    <Button
                      variant="outline"
                      onClick={() => handleViewDialogOpen(announcement)}
                      key={index}
                      className="my-2 flex size-full items-center justify-start space-x-2 rounded-md border p-2"
                    >
                      {icon}
                      <div>
                        <h3 className="text-left text-sm font-semibold dark:text-white">
                          {announcement.title || 'No Title'}
                        </h3>
                        <p className="text-left text-xs text-muted-foreground">
                          {new Date(announcement.StartDate).toLocaleDateString(
                            'en-US',
                            {
                              weekday: 'short',
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric',
                            },
                          )}
                        </p>
                      </div>
                    </Button>
                  );
                },
              )
            )}
          </ScrollArea>
        </div>
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
