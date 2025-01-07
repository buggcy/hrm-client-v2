import * as React from 'react';

import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const years = Array.from({ length: 2199 - 1965 + 1 }, (_, i) => 1965 + i);

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

interface TestProps {
  initialDate?: Date;
  onDateChange: (date: Date | undefined) => void;
  loading?: boolean;
  type?: string;
  className?: string;
  disable?: boolean;
}

type CustomDayPickerProps = TestProps & CalendarProps;

export default function CustomDayPicker({
  initialDate,
  onDateChange,
  loading,
  type,
  className,
  disable,
  disabled,
}: CustomDayPickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    initialDate || undefined,
  );

  const [selectedMonth, setSelectedMonth] = React.useState<number>(
    date?.getMonth() || new Date().getMonth(),
  );
  const [selectedYear, setSelectedYear] = React.useState<number>(
    date?.getFullYear() || new Date().getFullYear(),
  );

  const updateDate = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setMonth(month);
      updateDate(updatedDate);
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setFullYear(year);
      updateDate(updatedDate);
    }
  };

  const handleMonthNavigation = (newMonth: Date) => {
    setSelectedMonth(newMonth.getMonth());
    setSelectedYear(newMonth.getFullYear());
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={`relative h-[32px] justify-start text-left font-normal ${loading ? 'pr-10' : ''} ${className}`}
          disabled={disable}
        >
          <CalendarIcon className="mr-2 size-4" />
          {type === 'search' ? (
            date ? (
              format(date, 'PPP')
            ) : (
              <span>Search by date</span>
            )
          ) : date ? (
            format(date, 'PPP')
          ) : (
            <span>Pick a date</span>
          )}
          {loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex items-center justify-between gap-2 p-2">
          <Select
            value={selectedMonth.toString()}
            onValueChange={value => handleMonthChange(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedYear.toString()}
            onValueChange={value => handleYearChange(parseInt(value))}
          >
            <SelectTrigger className="max-w-[100px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-auto w-[270px] overflow-auto pb-2 pl-2">
          <DayPicker
            mode="single"
            selected={date}
            classNames={{
              caption: 'flex justify-center pt-1 relative items-center',
              caption_label: 'text-sm font-medium',
              nav: 'space-x-1 flex items-center',
              nav_button:
                'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full border-collapse space-y-1',
              head_row: 'flex mt-3',
              head_cell:
                'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
              row: 'flex w-full mt-2',
              cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
              day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
              day_selected:
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
              day_today: 'bg-accent text-accent-foreground',
              day_outside: 'text-muted-foreground opacity-50',
              day_disabled: 'text-muted-foreground opacity-50',
              day_range_middle:
                'aria-selected:bg-accent aria-selected:text-accent-foreground',
              day_hidden: 'invisible',
            }}
            onSelect={updateDate}
            month={new Date(selectedYear, selectedMonth)}
            showOutsideDays={true}
            onMonthChange={handleMonthNavigation}
            disabled={disabled}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
