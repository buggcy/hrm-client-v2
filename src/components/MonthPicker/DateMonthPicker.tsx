'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { format, subMonths } from 'date-fns';
import { CalendarIcon, ChevronsUpDown } from 'lucide-react';

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

export interface MonthPickerProps {
  timeRange: TimeRange;
  selectedMonth?: Date;
  setTimeRange: (timeRange: TimeRange) => void;
  setMonth: (month: Date | undefined) => void;
}

export type TimeRange = 'Current Month' | 'Last Month' | 'Custom';

export const useMonthPicker = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('Current Month');
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(
    new Date(),
  );

  const handleSetMonth = useCallback(
    (month: Date | undefined) => {
      setSelectedMonth(month);
      setTimeRange('Custom');
    },
    [setSelectedMonth, setTimeRange],
  );

  return { timeRange, selectedMonth, setTimeRange, handleSetMonth };
};

export const DateMonthPicker = ({
  timeRange,
  selectedMonth,
  setTimeRange,
  setMonth,
}: MonthPickerProps) => {
  const label = useMemo(() => {
    if (timeRange === 'Custom' && selectedMonth) {
      return format(selectedMonth, 'LLLL y');
    }
    return timeRange;
  }, [selectedMonth, timeRange]);

  useEffect(() => {
    if (timeRange === 'Current Month') {
      setMonth(new Date());
    } else if (timeRange === 'Last Month') {
      setMonth(subMonths(new Date(), 1));
    }
  }, [timeRange, setMonth]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="px-3 py-2">
        <Button
          variant="outline"
          className="min-w-40 gap-2 text-left font-medium"
        >
          <CalendarIcon className="size-4" />
          <span className="grow">{label}</span>
          <ChevronsUpDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-40">
        <DropdownMenuItem onSelect={() => setTimeRange('Current Month')}>
          Current Month
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTimeRange('Last Month')}>
          Last Month
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Custom</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <Calendar
                mode="single"
                selected={selectedMonth}
                onSelect={setMonth}
                showOutsideDays={false}
                numberOfMonths={1}
              />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
