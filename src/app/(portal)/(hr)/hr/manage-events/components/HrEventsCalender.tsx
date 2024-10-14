'use client';

import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Calendar,
  dateFnsLocalizer,
  ToolbarProps,
  View,
  Views,
} from 'react-big-calendar';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogOverlay } from '@/components/ui/dialog';
import { useStores } from '@/providers/Store.Provider';

import { useHrEventsQuery } from '@/hooks/hrEvents/useHrEventsQuery';
import { HrEventsListType } from '@/libs/validations/employee';
import { HrEventsStoreType } from '@/stores/hr/hrEvents';
import { cn } from '@/utils';

import { ViewHrEvent } from './ViewHrEvent';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css';

const locales = {
  'en-US': enUS,
};

type MyEvent = {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  Event_Name?: string;
  Event_Start?: string;
  Event_End?: string;
  Event_Type?: string;
  Event_Discription?: string;
  isEnabled?: boolean;
};

const localizer = dateFnsLocalizer({
  format,
  parse: (date: string | number | Date) => new Date(date),
  startOfWeek: (date: Date) => {
    const day = date.getDay();
    return new Date(date.setDate(date.getDate() - day));
  },
  getDay: (date: Date) => date.getDay(),
  locales,
});

const CustomToolbar: React.FC<ToolbarProps<MyEvent, object>> = ({
  date,
  onNavigate,
  onView,
  view,
}) => {
  return (
    <div className={cn('rbc-toolbar')}>
      <div className="flex space-x-3">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('PREV')}
            className=""
            style={{
              color: 'hsl(var(--forground))',
              borderTop: '1px solid hsl(var(--border))',
              borderLeft: '1px solid hsl(var(--border))',
              borderBottom: '1px solid hsl(var(--border))',
              borderRight: 'none',
              borderRadius: ' 5px 0 0 5px ',
              padding: '4px',
              fontSize: '12px',
              height: '25px',
            }}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('NEXT')}
            className=""
            style={{
              color: 'hsl(var(--forground))',
              borderLeft: 'none',
              borderTop: '1px solid hsl(var(--border))',
              borderRight: '1px solid hsl(var(--border))',
              borderBottom: '1px solid hsl(var(--border))',
              borderRadius: ' 0 4px 4px 0 ',
              padding: '4px',
              fontSize: '12px',
              height: '25px',
              border: '1px solid hsl(var(--border))',
            }}
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('TODAY')}
          className=""
          style={{
            fontSize: '12px',
            padding: '4px 12px',
            height: '25px',
            color: 'hsl(var(--forground))',
            border: '1px solid hsl(var(--border))',
          }}
        >
          Today
        </Button>
      </div>
      <span className={cn('rbc-toolbar-label text-lg')}>
        {format(date, 'MMMM yyyy')}
      </span>

      <div className={cn('rbc-btn-group')}>
        {(['month', 'week', 'day', 'agenda'] as View[]).map(name => (
          <Button
            key={name}
            variant="outline"
            size="sm"
            onClick={() => onView(name)}
            className={cn(view === name ? 'rbc-active' : '')}
            style={{
              fontSize: '12px',
              padding: '4px 12px',
              height: '25px',
              border: '1px solid hsl(var(--border))',

              backgroundColor: view === name ? '#e6e6e670' : '',
              color:
                view === name
                  ? 'hsl(var(--forground))'
                  : 'hsl(var(--muted-foreground))',
            }}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default function HrEventsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<HrEventsListType | null>({
    _id: '',
    hrId: undefined,
    Event_Name: '',
    Event_Start: '',
    Event_End: '',
    Event_Discription: '',
    isDeleted: false,
    isEnabled: true,
    Event_Type: '',
    __v: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    setIsDarkMode(prefersDarkMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const onNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const onView = (newView: View) => {
    setCurrentView(newView);
  };

  const eventStyleGetter = () => {
    const style = {
      className: 'event-style',
    };
    return style;
  };

  const page = 1;
  const limit = 1000;

  const { hrEventsStore } = useStores() as {
    hrEventsStore: HrEventsStoreType;
  };
  const { setRefetchHrEventsList, refetchHrEventsList } = hrEventsStore;

  const { data: hrEventsList, refetch } = useHrEventsQuery({
    page: page,
    limit: limit,
  });

  useEffect(() => {
    if (refetchHrEventsList) {
      void (async () => {
        await refetch();
      })();

      setRefetchHrEventsList(false);
    }
  }, [refetchHrEventsList, page, limit, setRefetchHrEventsList, refetch]);

  const dayPropGetter = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isPreviousMonth = date.getMonth() < currentDate.getMonth();
    const isNextMonth = date.getMonth() > currentDate.getMonth();

    let style = {};

    if (isToday) {
      style = {
        backgroundColor: '#ffeb3b3b',
        border: '1px solid #fbc12d4a',
        color: '#000',
      };
    } else if (!isCurrentMonth) {
      if (isPreviousMonth) {
        style = {
          backgroundColor: 'hsl(var(--muted))',
          color: '#000',
        };
      } else if (isNextMonth) {
        style = {
          backgroundColor: 'hsl(var(--muted))',
          color: '#000',
        };
      }
    }

    return { style };
  };

  const formattedEvents = hrEventsList?.data?.map(event => ({
    id: event._id,
    title: event.Event_Name || 'Untitled Event',
    start: event.Event_Start ? new Date(event.Event_Start) : new Date(),
    end: event.Event_End
      ? new Date(
          new Date(event.Event_End).setDate(
            new Date(event.Event_End).getDate() + 1,
          ),
        )
      : new Date(),
    Event_Name: event.Event_Name,
    Event_Start: event.Event_Start,
    Event_End: event.Event_End,
    Event_Type: event.Event_Type,
    Event_Discription: event.Event_Discription,
    isEnabled: event?.isEnabled === true,
  }));

  const handleEventClick = (event: HrEventsListType) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedEvent(null);
    setIsDialogOpen(false);
  };

  return (
    <Card
      className={cn(
        `mx-auto w-full ${isDarkMode ? 'bg-dark-background' : 'bg-background'} text-foreground`,
      )}
    >
      <CardContent className="p-6">
        <div>
          <Calendar<MyEvent>
            localizer={localizer}
            events={formattedEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400 }}
            date={currentDate}
            view={currentView}
            onNavigate={onNavigate}
            onView={onView}
            eventPropGetter={eventStyleGetter}
            components={{
              toolbar: CustomToolbar,
            }}
            // @ts-ignore
            onSelectEvent={handleEventClick}
            dayPropGetter={dayPropGetter}
          />
        </div>
      </CardContent>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogOverlay>
            {/* eslint-disable-next-line react/prop-types */}
            {/* @ts-ignore */}
            <ViewHrEvent event={selectedEvent} onClose={closeDialog} />
          </DialogOverlay>
        </Dialog>
      )}
    </Card>
  );
}
