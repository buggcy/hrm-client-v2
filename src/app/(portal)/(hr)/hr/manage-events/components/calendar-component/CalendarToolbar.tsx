import { useEffect, useState } from 'react';

import { Cake, CalendarArrowDown, CalendarArrowUp, Gift } from 'lucide-react';

import { MyEvent } from '@/libs/validations/employee';

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
      backgroundColor: isDarkMode
        ? 'hsl(var(--warning))'
        : 'hsl(var(--warning))',
    },
    holiday: {
      backgroundColor: isDarkMode
        ? 'hsl(var(--success))'
        : 'hsl(var(--success))',
    },
    nonHoliday: {
      backgroundColor: isDarkMode
        ? 'hsl(var(--primary))'
        : 'hsl(var(--primary))',
    },
    anniversary: {
      backgroundColor: isDarkMode ? 'hsl(var(--danger))' : 'hsl(var(--danger))',
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
      className={`absolute z-50 rounded-lg shadow-lg transition-all duration-500 ease-in-out${
        isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : '-translate-y-4 scale-95 opacity-0'
      } bg-white dark:bg-gray-300`}
      style={{
        width: '200px',
        left:
          event.Event_Type === 'holiday' || event.Event_Type === 'company'
            ? x - 100
            : x - 164,
        top:
          event.Event_Type === 'holiday' || event.Event_Type === 'company'
            ? y - 85
            : y - 88,
        padding: '10px',
      }}
    >
      <div
        className="mb-1 flex flex-row justify-center gap-1 rounded-lg border p-1"
        style={{
          backgroundColor: currentStyle.backgroundColor,
          border: 'none',
        }}
      >
        {event.Event_Type === 'birthday' ? (
          <Cake size={18} className="font-extrabold text-white" />
        ) : event.Event_Type === 'anniversary' ? (
          <Gift size={18} className="font-extrabold text-white" />
        ) : event.Event_Type === 'holiday' ? (
          <CalendarArrowUp size={18} className="font-extrabold text-white" />
        ) : event.Event_Type === 'company' ? (
          <CalendarArrowDown size={18} className="font-extrabold text-white" />
        ) : (
          <> </>
        )}
        <h3 className="text-center text-sm font-bold capitalize text-white">
          {event?.Event_Type}
        </h3>
      </div>

      <div className="m-1 text-center text-sm capitalize text-gray-600">{`${event?.title}`}</div>

      <div
        className="absolute size-3 rotate-45"
        style={{
          bottom: '-6px',
          left: 'calc(50% - 6px)',
          backgroundColor: currentStyle.backgroundColor,
        }}
      ></div>
    </div>
  );
};

export default Tooltip;
