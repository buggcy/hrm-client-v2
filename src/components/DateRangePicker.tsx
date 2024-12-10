'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { format, subDays } from 'date-fns';
import { CalendarDays, ChevronsUpDown } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface HeaderProps {
  timeRange: TimeRange;
  selectedDate?: DateRange;
  setTimeRange: (timeRange: TimeRange) => void;
  setDate: (date: DateRange | undefined) => void;
}
export type TimeRange =
  | 'Current Month'
  | 'Last Month'
  | 'Last 3 Months'
  | 'Last 6 Months'
  | 'Custom';
export const useTimeRange = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('Current Month');
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const handleSetDate = useCallback(
    (date: DateRange | undefined) => {
      setSelectedDate(date);
      setTimeRange('Custom');
    },
    [setSelectedDate, setTimeRange],
  );
  return { timeRange, selectedDate, setTimeRange, handleSetDate };
};
export const DateRangePicker = ({
  timeRange,
  selectedDate,
  setTimeRange,
  setDate,
}: HeaderProps) => {
  const label = useMemo(() => {
    if (timeRange === 'Custom') {
      if (selectedDate?.from) {
        if (selectedDate.to) {
          return `${format(selectedDate.from, 'LLL dd, y')} - ${format(selectedDate.to, 'LLL dd, y')}`;
        } else {
          return format(selectedDate.from, 'LLL dd, y');
        }
      }
    }
    return timeRange;
  }, [selectedDate, timeRange]);

  useEffect(() => {
    const now = new Date();
    if (timeRange === 'Current Month') {
      setDate({
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      });
    } else if (timeRange === 'Last Month') {
      setDate({
        from: subDays(new Date(), 30),
        to: new Date(),
      });
    } else if (timeRange === 'Last 3 Months') {
      setDate({
        from: subDays(new Date(), 90),
        to: new Date(),
      });
    } else if (timeRange === 'Last 6 Months') {
      setDate({
        from: subDays(new Date(), 180),
        to: new Date(),
      });
    }
  }, [timeRange, setDate]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="px-3 py-2">
        <Button
          variant="outline"
          className="min-w-40 gap-4 text-left font-medium"
        >
          <span className="grow">{label}</span>
          <ChevronsUpDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-40">
        <DropdownMenuItem onSelect={() => setTimeRange('Current Month')}>
          Current month
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTimeRange('Last Month')}>
          Last month
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTimeRange('Last 3 Months')}>
          Last 3 months
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTimeRange('Last 6 Months')}>
          Last 6 months
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>
              <CalendarDays className="mr-2 size-4" />
            </span>
            Custom
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="mx-1">
              <Calendar
                mode="range"
                defaultMonth={selectedDate?.from}
                selected={selectedDate}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
