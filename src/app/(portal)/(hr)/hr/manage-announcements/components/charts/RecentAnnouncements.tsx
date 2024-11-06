'use client';

import { useState } from 'react';

import { CircleArrowDown, CircleArrowRight, CircleArrowUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
          icon: <CircleArrowUp className="size-6" />, // Red for high priority alert
          color: 'text-red-600',
        };
      case 'medium':
        return {
          icon: <CircleArrowRight className="size-6" />, // Yellow for medium priority info
          color: 'text-yellow-500',
        };
      case 'low':
      default:
        return {
          icon: <CircleArrowDown className="size-6" />, // Green for low priority checkmark
          color: 'text-green-500',
        };
    }
  };

  return (
    <Card className="mb-2 size-full dark:bg-zinc-900">
      <CardHeader className="pb-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold dark:text-white">
            Upcoming Announcements
          </h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[300px] space-y-4 overflow-y-auto">
          {isFetching ? (
            <div className="text-sm text-gray-500 dark:text-gray-300">
              Loading Announcements
            </div>
          ) : announcementArray?.length <= 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-300">
              No Announcements
            </div>
          ) : (
            announcementArray.map(
              (announcement: AnnouncementType, index: number) => {
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
                    key={index}
                    className="flex size-full items-center justify-start space-x-2 rounded-md border p-2"
                    variant="outline"
                    onClick={() => handleViewDialogOpen(announcement)}
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
