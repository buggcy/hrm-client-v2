'use client';

import { useState } from 'react';

import { CircleArrowDown, CircleArrowRight, CircleArrowUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { AnnouncementType } from '@/libs/validations/hr-announcements';

import { ViewAnnouncement } from '../ViewAnnouncementDialog.component';

interface RecentAnnouncementProps {
  announcements?: AnnouncementType[];
  isFetching: boolean;
}

const RecentAnnouncements = ({
  announcements,
  isFetching,
}: RecentAnnouncementProps) => {
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementType>();
  const handleViewDialogOpen = (announcement: AnnouncementType) => {
    setSelectedAnnouncement(announcement);
    setShowViewDialog(true);
  };

  const handleViewDialogClose = () => {
    setShowViewDialog(false);
  };
  const announcementArray: AnnouncementType[] = Array.isArray(announcements)
    ? announcements.filter(announcement => announcement !== undefined)
    : [announcements].filter(announcement => announcement !== undefined);

  const getIconAndColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return {
          icon: <CircleArrowUp className="size-6 text-red-600" />,
          color: 'text-red-600',
        };
      case 'medium':
        return {
          icon: <CircleArrowRight className="size-6 text-yellow-500" />,
          color: 'text-yellow-500',
        };
      case 'low':
      default:
        return {
          icon: <CircleArrowDown className="size-6 text-green-500" />,
          color: 'text-green-500',
        };
    }
  };

  return (
    <Card className="mb-2 size-full dark:bg-zinc-900">
      <CardHeader>
        <CardTitle>Upcoming Announcement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[300px] space-y-4">
          <ScrollArea className="h-[280px] w-full">
            {isFetching ? (
              <div className="mt-32 text-center text-xs text-gray-600 dark:text-gray-300">
                Loading...
              </div>
            ) : announcementArray?.length <= 0 ? (
              <div className="mt-24 items-center justify-center text-center text-xs text-gray-600 dark:text-gray-300">
                No Announcements
              </div>
            ) : (
              announcementArray.map(
                (announcement: AnnouncementType, index: number) => {
                  const { icon } = getIconAndColor(
                    announcement.Priority || 'normal',
                  );

                  return (
                    <Button
                      key={index}
                      className="mt-2 flex size-full items-center justify-start space-x-2 rounded-md border p-2"
                      variant="outline"
                      onClick={() => handleViewDialogOpen(announcement)}
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
        open={showViewDialog}
        onOpenChange={handleViewDialogClose}
        onCloseChange={handleViewDialogClose}
        user="hr"
      />
    </Card>
  );
};

export default RecentAnnouncements;
