'use client';
import { useEffect } from 'react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useEmployeeAttendance } from '@/hooks/employee/useEmployeeAttendance';
import { useUserId } from '@/hooks/employee/useUserId';

import { EmployeeAttendenceCard } from './AttendenceRecord';
import Typography from '../components/Typography';

import { AttendanceReport } from '@/types/attendence.types';

const EmployeeCard = ({
  attendanceReport,
}: {
  attendanceReport?: AttendanceReport | null;
}) => {
  const userId = useUserId();
  const {
    data: empdata,
    isLoading,
    isFetching,
  } = useEmployeeAttendance(userId);

  useEffect(() => {}, [userId, empdata]);
  const totalHoursOfWeek =
    isLoading || isFetching ? '0' : empdata?.totalHoursOfWeek || '0';
  const todayStartTime =
    isLoading || isFetching ? '0' : empdata?.todayStartTime || '0';
  const todayTotalHours =
    isLoading || isFetching ? '0' : empdata?.todayTotalHours || '0';
  const noOfPresents = attendanceReport?.noOfPresents || 0;
  const noOfLeaves = attendanceReport?.noOfLeaves || 0;
  const noOfAbsents = attendanceReport?.noOfAbsents || 0;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card className="rounded-lg p-0 dark:bg-zinc-900">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg dark:text-white">
              Today&apos;s Attendance
            </CardTitle>
            <Link
              href="/employee/attendance/attendance-history"
              className="flex justify-between align-middle text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              View Stats
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <hr className="mb-4 mt-0 border-gray-200 dark:border-gray-700" />
          <div className="flex items-center justify-between">
            <div>
              <Typography className="py-2.5 text-sm font-normal text-gray-500 dark:text-gray-300">
                <strong className="text-black dark:text-white">
                  {todayTotalHours}
                </strong>{' '}
                Total Hours
              </Typography>
              <Typography className="py-2.5 text-sm font-normal text-gray-500 dark:text-gray-300">
                <strong className="text-black dark:text-white">
                  {totalHoursOfWeek}
                </strong>{' '}
                Total Weekly Hours
              </Typography>
              <Typography className="py-2.5 text-sm font-normal text-gray-500 dark:text-gray-300">
                <strong className="text-black dark:text-white">
                  {todayStartTime}
                </strong>{' '}
                Today&apos;s Start Time
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      <EmployeeAttendenceCard
        noOfPresents={noOfPresents}
        noOfAbsents={noOfAbsents}
        noOfLeaves={noOfLeaves}
      />
    </div>
  );
};

export default EmployeeCard;
