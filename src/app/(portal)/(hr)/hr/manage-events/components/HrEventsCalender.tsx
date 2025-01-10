'use client';

import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  Cake,
  CalendarCog,
  ChevronLeft,
  ChevronRight,
  Gift,
} from 'lucide-react';
import {
  Calendar,
  dateFnsLocalizer,
  ToolbarProps,
  View,
  Views,
} from 'react-big-calendar';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStores } from '@/providers/Store.Provider';

import { useEmployeeDobStatsQuery } from '@/hooks/employee/useApprovalEmployee.hook';
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
type EmployeeDob = {
  firstName: string;
  lastName: string;
  DOB: Date;
  Joining_Date?: Date | null;
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

  const Tooltip: React.FC<{ event?: MyEvent; x: number; y: number }> = ({
    event,
    x,
    y,
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    useEffect(() => {
      if (event) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, [event]);

    if (!event) return null;

    const tooltipStyles = {
      birthday: {
        backgroundColor: isDarkMode ? '#f9c74f' : '#fdf0c1',
      },
      holiday: {
        backgroundColor: isDarkMode ? 'hsl(var(--success))' : '#b8e6c1',
      },
      nonHoliday: {
        backgroundColor: isDarkMode ? 'hsl(var(--primary))' : '#a8dff5',
      },
      anniversary: {
        backgroundColor: isDarkMode ? '#0F172A' : '#8caabf',
      },
    };

    const currentStyle =
      event.Event_Type === 'birthday'
        ? tooltipStyles.birthday
        : event.Event_Type === 'holiday'
          ? tooltipStyles.holiday
          : event.Event_Type === 'anniversary'
            ? tooltipStyles.anniversary
            : tooltipStyles.nonHoliday;

    return (
      <div
        className={`absolute z-50 rounded border border-gray-300 p-2 shadow transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '200px',
          left: x,
          top: y,
          backgroundColor: currentStyle.backgroundColor,
          transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex w-full flex-col">
            <div className="mb-2 flex w-full justify-center align-middle">
              {event.Event_Type === 'birthday' ? (
                <Cake
                  size={24}
                  className="text-[#f9c74f] dark:text-[#fdf0c1]"
                />
              ) : event.Event_Type === 'anniversary' ? (
                <Gift
                  size={24}
                  className="text-[#0F172A] dark:text-[#8caabf]"
                />
              ) : (
                <CalendarCog
                  size={24}
                  className={`${
                    event?.Event_Type === 'holiday'
                      ? 'text-success dark:text-[#b8e6c1]'
                      : 'text-primary dark:text-[#a8dff5]'
                  }`}
                />
              )}
            </div>
            <div className="flex items-center gap-2 p-1">
              <div className={`size-2 rounded-full bg-gray-600`}></div>
              <h3 className="mr-2 text-gray-600">
                {event?.Event_Type
                  ? event?.Event_Type?.charAt(0)?.toUpperCase() +
                    event?.Event_Type?.slice(1)?.toLowerCase()
                  : ''}
              </h3>
            </div>
            <div className="flex items-center gap-2 p-1">
              <div className="size-2 rounded-full bg-gray-600"></div>
              <h3 className="mr-2 text-gray-600">{`${event?.title}`} </h3>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

  const eventStyleGetter = (event: MyEvent) => {
    let className = 'event-style';

    if (event.Event_Type === 'holiday') {
      className = 'event-holiday';
    } else if (event.Event_Type === 'company') {
      className = 'event-non-holiday';
    } else if (event.Event_Type === 'birthday') {
      className = 'event-birthday';
    } else if (event.Event_Type === 'anniversary') {
      className = 'event-anniversary';
    }

    return {
      className,
    };
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

  type CustomEventProps = {
    event: MyEvent;
  };

  const CustomEvent: React.FC<CustomEventProps> = ({ event }) => {
    const handleMouseEnter = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        visible: true,
        event,
        x: rect.left + window.scrollX - 5,
        y: rect.top + window.scrollY - 70,
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
          <Cake className="mr-2 inline-block size-4" />
        )}
        {event.Event_Type === 'anniversary' && (
          <Gift color="#0F172A" className="mr-2 inline-block size-4" />
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
