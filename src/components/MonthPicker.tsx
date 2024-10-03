'use client';

import React, { useState } from 'react';

import { CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import 'react-datepicker/dist/react-datepicker.css';
import './MonthPicker.css';

interface MonthPickerProps {
  setDateValue: (date: Date | null) => void;
  initialDate: Date | null;
}

export function MonthPickerComponent({
  setDateValue,
  initialDate,
}: MonthPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [isOpen, setIsOpen] = useState(false);

  const handleMonthChange = (date: Date | null) => {
    setSelectedDate(date);
    setIsOpen(false);
    setDateValue(date);
  };

  const toggleCalendar = () => setIsOpen(!isOpen);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select month';
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal"
          onClick={toggleCalendar}
        >
          <CalendarIcon className="mr-2 size-4" />
          {formatDate(selectedDate)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[122px] w-auto p-0" align="start">
        <DatePicker
          selected={selectedDate}
          onChange={handleMonthChange}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          inline
        />
      </PopoverContent>
    </Popover>
  );
}
