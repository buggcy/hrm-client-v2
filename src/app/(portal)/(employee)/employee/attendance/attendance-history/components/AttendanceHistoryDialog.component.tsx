import React from 'react';

import {
  AlarmClockCheck,
  AlarmClockMinus,
  Calendar,
  Clock,
} from 'lucide-react';
import moment from 'moment-timezone';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { formatUTCToLocalTime } from '@/app/(portal)/(hr)/hr/manage-attendance/attendance-list/components/AttendanceDialog';
import { BreaksTable } from '@/app/(portal)/(hr)/hr/manage-attendance/attendance-list/components/BreaksTable';
import { AttendanceHistoryListType } from '@/libs/validations/attendance-history';
import { AttendanceBreaks } from '@/libs/validations/attendance-list';

interface AttendanceHistoryDialogProps {
  data: AttendanceHistoryListType;
  open: boolean;
  onOpenChange: () => void;
  onCloseChange?: () => void;
}

const AttendanceHistoryDialog = ({
  data,
  open,
  onOpenChange,
}: AttendanceHistoryDialogProps) => {
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
  const date = data?.date ? new Date(data?.date) : new Date();
  const breaks: AttendanceBreaks[] = data?.breaks;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[600px]">
        <DialogHeader className="mt-2 flex flex-row items-center justify-between">
          <DialogTitle>Attendance Details</DialogTitle>
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
        </DialogHeader>

        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
          <div className="flex items-center gap-2">
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
            <AlarmClockCheck color="hsl(var(--chart-1))" size={16} />
            <span>Start Time:</span>
            <span>{startTime}</span>
          </div>
          <div className="flex items-center gap-2 py-2">
            <AlarmClockMinus color="hsl(var(--chart-3))" size={16} />
            <span>End Time:</span>
            <span>{endTime}</span>
          </div>
        </div>

        <div className="w-full border-t-2 pt-4">
          <span className="pb-4">Breaks:</span>
          {breaks?.length > 0 ? (
            <BreaksTable data={breaks} />
          ) : (
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              No breaks found!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceHistoryDialog;
