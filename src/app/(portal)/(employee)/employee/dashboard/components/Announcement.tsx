import { useEffect } from 'react';

import { CheckCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useRecentAnnouncements } from '@/hooks/employee/useRecentAnnouncement';

interface Announcement {
  _id: string;
  hrId: string;
  title: string;
  StartDate: string;
  EndDate: string;
  Priority: string;
  TargetAudience: string;
  Description: string;
  isDeleted: boolean;
  isEnabled: boolean;
}

const RecentAnnouncements = () => {
  const {
    data: announcements,
    isLoading,
    isFetching,
  } = useRecentAnnouncements();

  useEffect(() => {}, [announcements]);
  console.log(announcements);

  const announcementArray: Announcement[] = Array.isArray(announcements)
    ? announcements.filter(announcement => announcement !== undefined)
    : [announcements].filter(announcement => announcement !== undefined);
  return (
    <Card className="mb-2 w-full px-6 py-9">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Announcements</h2>
        <button className="rounded-xl border-red-100 bg-green-600 px-5 py-1 text-sm text-white">
          {isLoading || isFetching ? '0' : announcementArray.length || '0'}{' '}
          Recent
        </button>
      </div>

      <div className="max-h-20 space-y-4 overflow-y-auto">
        <hr className="border-gray-200 p-2" />
        {isLoading || isFetching ? (
          <div className="flex items-start space-x-4">
            <div>
              <h3 className="ml-2 text-sm font-semibold text-gray-900">
                No Recent Announcements
              </h3>
            </div>
          </div>
        ) : announcementArray.length === 0 ? (
          <div>No recent announcements.</div>
        ) : (
          announcementArray.map((announcement: Announcement, index: number) => (
            <div key={index} className="flex items-start space-x-4">
              <CheckCircleIcon className="size-6 text-blue-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {announcement.title || 'No Title'}
                </h3>
                <p className="text-sm text-gray-500">
                  {announcement.Description || 'No Description'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <Button variant="secondary" className="w-full bg-blue-100 text-primary">
          View All Announcements
        </Button>
      </div>
    </Card>
  );
};

export default RecentAnnouncements;
