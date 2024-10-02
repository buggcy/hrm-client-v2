import { useEffect } from 'react';

import { Briefcase } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useEventsData } from '@/hooks/employee/useEventData';
const UpcomingEvents = () => {
  const { data: eventsData, isLoading, isFetching } = useEventsData();
  useEffect(() => {}, [eventsData]);
  const events = isLoading || isFetching ? [] : eventsData || [];

  return (
    <Card className="mb-2 px-6 py-9">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        <button className="rounded-xl border-red-100 bg-blue-500 px-3 py-1 text-sm text-white">
          {events.length || '0'} Upcoming
        </button>
      </div>

      <div className="max-h-20 space-y-4 overflow-y-auto">
        <hr className="border-gray-200 p-2" />
        {events.length === 0 && !isLoading && !isFetching && (
          <div>No upcoming events.</div>
        )}
        {events.map((event, index) => (
          <div key={index} className="flex items-start space-x-4">
            <Briefcase className="size-6 text-blue-500" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {event.title || 'No Title'}
              </h3>
              <p className="text-sm text-gray-500">{event.type || 'No Type'}</p>
            </div>
            <div className="ml-auto mt-2 text-xs text-gray-400">
              {Intl.DateTimeFormat('en-US', {
                timeStyle: 'short',
              }).format(new Date(event.start))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button variant="secondary" className="w-full bg-blue-100 text-primary">
          View All Events
        </Button>
      </div>
    </Card>
  );
};

export default UpcomingEvents;
