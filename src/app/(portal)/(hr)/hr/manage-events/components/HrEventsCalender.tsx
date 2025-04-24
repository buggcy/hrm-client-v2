'use client';

import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Cake, Gift } from 'lucide-react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';

import { Card, CardContent } from '@/components/ui/card';
import { useStores } from '@/providers/Store.Provider';

import { useEmployeeDobStatsQuery } from '@/hooks/employee/useApprovalEmployee.hook';
import { useHrEventsQuery } from '@/hooks/hrEvents/useHrEventsQuery';
import {
  CustomEventProps,
  EmployeeDob,
  HrEventsListType,
  MyEvent,
} from '@/libs/validations/employee';
import { HrEventsStoreType } from '@/stores/hr/hrEvents';
import { cn } from '@/utils';

import Tooltip from './calendar-component/CalendarToolbar';
import { eventStyleGetter } from './calendar-component/calenderStyle';
import CustomToolbar from './calendar-component/CustomToolbar';
import { ViewHrEvent } from './ViewHrEvent';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css';

const locales = {
  'en-US': enUS,
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

export default function HrEventsCalendar() {
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

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<HrEventsListType>({
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
  const { data: empDobDate } = useEmployeeDobStatsQuery();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    event?: MyEvent;
    x: number;
    y: number;
  }>({
    visible: false,
    event: undefined,
    x: 0,
    y: 0,
  });

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
    end: event.Event_End ? new Date(event.Event_End) : new Date(),
    Event_Name: event.Event_Name,
    Event_Start: event.Event_Start,
    Event_End: event.Event_End,
    Event_Type: event.Event_Type,
    Event_Discription: event.Event_Discription,
    isEnabled: event?.isEnabled === true,
  }));

  const CustomEvent: React.FC<CustomEventProps> = ({ event }) => {
    const handleMouseEnter = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        visible: true,
        event,
        x: rect.left,
        y: rect.top,
      });
    };

    const handleMouseLeave = () => {
      setTooltip({ visible: false, event: undefined, x: 0, y: 0 });
    };

    return (
      <div
        title={event.title}
        className={cn('event-tooltip')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {event.Event_Type === 'birthday' && (
          <Cake className="inline-block size-4" />
        )}

        {event.Event_Type === 'anniversary' && (
          <Gift color="#0F172A" className="inline-block size-4" />
        )}

        {event.Event_Type === 'company' || event.Event_Type === 'holiday'
          ? event.title
          : ''}
      </div>
    );
  };

  const formattedDobEvents: MyEvent[] | undefined = empDobDate?.flatMap(
    (dobEvent: EmployeeDob) => {
      const dob = new Date(dobEvent?.DOB ?? '');
      const currentYear = new Date().getFullYear();

      const yearRange = 5;
      const eventsForBirthday = [];

      for (let yearOffset = -yearRange; yearOffset <= yearRange; yearOffset++) {
        const year = currentYear + yearOffset;
        const birthdayThisYear = new Date(year, dob.getMonth(), dob.getDate());

        eventsForBirthday.push({
          id: `dob-${dobEvent.firstName}-${dobEvent.lastName}-${year}`,
          title: `${dobEvent.firstName.trim()} ${dobEvent.lastName.trim()}`,
          start: birthdayThisYear,
          end: new Date(birthdayThisYear.setDate(birthdayThisYear.getDate())),
          Event_Type: 'birthday',
        });
      }

      return eventsForBirthday;
    },
  );

  const formattedAnniversaryEvents: MyEvent[] | undefined = empDobDate?.flatMap(
    (dobEvent: EmployeeDob) => {
      const joiningDate = new Date(dobEvent?.Joining_Date ?? '');
      const currentYear = new Date().getFullYear();

      const yearRange = 5;
      const eventsForAnniversary = [];

      for (let yearOffset = -yearRange; yearOffset <= yearRange; yearOffset++) {
        const year = currentYear + yearOffset;
        const anniversaryThisYear = new Date(
          year,
          joiningDate.getMonth(),
          joiningDate.getDate(),
        );

        eventsForAnniversary.push({
          id: `anniversary-${dobEvent.firstName}-${dobEvent.lastName}-${year}`,
          title: `${dobEvent.firstName.trim()} ${dobEvent.lastName.trim()}`,
          start: anniversaryThisYear,
          end: new Date(
            anniversaryThisYear.setDate(anniversaryThisYear.getDate()),
          ),
          Event_Type: 'anniversary',
        });
      }

      return eventsForAnniversary;
    },
  );

  const allEvents = [
    ...(formattedEvents || []),
    ...(formattedDobEvents || []),
    ...(formattedAnniversaryEvents || []),
  ];

  const handleEventClick = (event: HrEventsListType) => {
    if (event.Event_Type !== 'birthday' && event.Event_Type !== 'anniversary') {
      setSelectedEvent(event);
      setIsDialogOpen(true);
      setTooltip({ visible: false, event: undefined, x: 0, y: 0 });
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Card
      className={cn(
        `mx-auto w-full ${isDarkMode ? 'bg-dark-background' : 'bg-background'} text-foreground`,
      )}
    >
      <CardContent className="p-0 pt-2 sm:p-6">
        <div>
          <Calendar<MyEvent>
            localizer={localizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            className="calendar-height"
            date={currentDate}
            popup
            view={currentView}
            onNavigate={onNavigate}
            onView={onView}
            eventPropGetter={eventStyleGetter}
            components={{
              toolbar: CustomToolbar,
              event: CustomEvent,
            }}
            // @ts-ignore
            onSelectEvent={handleEventClick}
            dayPropGetter={dayPropGetter}
          />
          {tooltip.visible && (
            <Tooltip event={tooltip.event} x={tooltip.x} y={tooltip.y} />
          )}
        </div>
      </CardContent>

      <ViewHrEvent
        event={selectedEvent}
        onCloseChange={closeDialog}
        onOpenChange={closeDialog}
        open={isDialogOpen}
      />
    </Card>
  );
}
