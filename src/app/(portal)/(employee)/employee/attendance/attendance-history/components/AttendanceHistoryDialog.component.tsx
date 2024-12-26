import React from 'react';

import {
  AlarmClockCheck,
  AlarmClockMinus,
  Calendar,
  Clock,
} from 'lucide-react';

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
  const startTime = formatUTCToLocalTime(data?.Start_Date);
  const endTime = formatUTCToLocalTime(data?.End_Date || '');
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
      <DialogContent>
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
          <div className="flex items-center">
            <Calendar className="mr-2" size={16} />
            <span>Date:</span>
            <span className="ml-4">{date.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center py-2">
            <Clock size={16} className="mr-2" />
            <span>Total Time:</span>
            <span className="pl-1">{totalTime}</span>
          </div>
          <div className="flex items-center py-2">
            <AlarmClockCheck
              size={16}
              color="hsl(var(--chart-1))"
              className="mr-2"
            />{' '}
            <span>Start Time:</span>
            <span className="ml-4">{startTime}</span>
          </div>
          <div className="flex items-center py-2">
            <AlarmClockMinus
              size={16}
              color="hsl(var(--chart-3))"
              className="mr-2"
            />
            <span>End Time:</span>
            <span className="ml-4">{endTime}</span>
          </div>
        </div>

        <div className="w-full border-t-2 pt-4">
          <span className="pb-4">Breaks:</span>
          <BreaksTable data={breaks} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceHistoryDialog;
