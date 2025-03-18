'use client';

import React from 'react';

import {
  AlarmClockCheck,
  AlarmClockMinus,
  Calendar,
  Clock,
} from 'lucide-react';
import moment from 'moment-timezone';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  AttendanceBreaks,
  AttendanceListType,
  AttendanceUser,
} from '@/libs/validations/attendance-list';

import { formatUTCToLocalTime } from './AttendanceDialog';
import { BreaksTable } from './BreaksTable';

interface DialogDemoProps {
  data: AttendanceListType;
  open: boolean;
  onOpenChange: () => void;
  onCloseChange?: () => void;
}

export function ViewAttendanceDialog({
  data,
  open,
  onOpenChange,
}: DialogDemoProps) {
  const user: AttendanceUser = data?.user;
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const avatar = user?.Avatar;
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;

  const startTime = data?.Start_Date
    ? moment(data?.Start_Date).utc().format('HH:mm') === '00:00'
      ? '00:00'
      : formatUTCToLocalTime(data?.Start_Date)
    : '00:00';
  const endTime = data?.End_Date
    ? moment(data?.End_Date).utc().format('HH:mm') === '00:00'
      ? '00:00'
      : formatUTCToLocalTime(data?.End_Date)
    : '00:00';
  const totalTimeStr = data?.Total_Time;
  let totalTimeInMinutes = 0;
  if (typeof totalTimeStr === 'string') {
    totalTimeInMinutes = parseInt(totalTimeStr, 10);
  }

  const hours = Math.floor(totalTimeInMinutes / 60);
  const minutes = totalTimeInMinutes % 60;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const totalTime = `${formattedHours}:${formattedMinutes}`;
  const status = data?.Status;
  const date = data?.date ? new Date(data.date) : new Date();
  const breaks: AttendanceBreaks[] = data?.breaks;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attendance Details</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-8">
              <AvatarImage
                src={avatar || ''}
                alt={`${firstName} ${lastName}`}
              />
              <AvatarFallback className="text-xs uppercase">
                {initials}
              </AvatarFallback>
            </Avatar>

            <span className="max-w-[500px] truncate font-medium capitalize">
              {`${firstName} ${lastName}`}
            </span>
          </div>
          <Badge
            className="ml-2 px-2 py-1"
            variant={
              status === 'Present'
                ? 'success'
                : status === 'Absent'
                  ? 'error'
                  : 'warning'
            }
          >
            {status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
          <div className="flex items-center gap-2 py-2">
            <Calendar size={16} />
            <span>Date:</span>
            <span>{date ? new Date(date).toDateString() : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 py-2">
            <Clock size={16} />
            <span>Total Time:</span>
            <span>{totalTime}</span>
          </div>
          <div className="flex items-center gap-2 py-2">
            <AlarmClockCheck size={16} color="hsl(var(--chart-1))" />
            <span>Start Time:</span>
            <span>{startTime}</span>
          </div>
          <div className="flex items-center gap-2 py-2">
            <AlarmClockMinus size={16} color="hsl(var(--chart-3))" />
            <span>End Time:</span>
            <span>{endTime}</span>
          </div>
        </div>

        <div className="w-full border-t-2 pt-4">
          <div className="flex flex-row justify-between">
            <span className="pb-4">Breaks:</span>
            {breaks?.length > 0 && (
              <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                {breaks?.length || 0}
              </span>
            )}
          </div>
          {breaks?.length > 0 ? (
            <BreaksTable data={breaks} />
          ) : (
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              No breaks data found!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
