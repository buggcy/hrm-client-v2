'use client';

import { Clock } from 'lucide-react';

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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TimePickerProps {
  time: string;
  onTimeChange: (time: string) => void;
}

export default function TimePicker({ time, onTimeChange }: TimePickerProps) {
  const [hour, minute, period] = time.split(/[: ]/);

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );

  const handleHourChange = (newHour: string) => {
    onTimeChange(`${newHour || '--'}:${minute || '--'} ${period || '--'}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    onTimeChange(`${hour || '--'}:${newMinute || '--'} ${period || '--'}`);
  };

  const handlePeriodChange = (newPeriod: string) => {
    onTimeChange(`${hour || '--'}:${minute || '--'} ${newPeriod || '--'}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal"
        >
          <Clock className="mr-2 size-4" />
          {hour || '--'}:{minute || '--'} {period || '--'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-4">
        <div className="flex items-center space-x-2">
          <Select value={hour} onValueChange={handleHourChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {hours.map(h => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>:</span>
          <Select value={minute} onValueChange={handleMinuteChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map(m => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ToggleGroup
            type="single"
            value={period}
            onValueChange={(value: string) =>
              value && handlePeriodChange(value)
            }
          >
            <ToggleGroupItem value="AM" aria-label="AM" className="w-[50px]">
              AM
            </ToggleGroupItem>
            <ToggleGroupItem value="PM" aria-label="PM" className="w-[50px]">
              PM
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
}
