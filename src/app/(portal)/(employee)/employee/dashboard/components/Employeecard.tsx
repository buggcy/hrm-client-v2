import { useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAttendanceReport } from '@/hooks/employee/useAttendenceReport';
import { useEmployeeAttendance } from '@/hooks/employee/useEmployeeAttendance';
import { useUserId } from '@/hooks/employee/useUserId';
import { getTotalWorkingDaysInCurrentMonth } from '@/utils';

import ProgressCircle from './ProgressCircle';
import Typography from '../components/Typography';

const EmployeeCard = () => {
  const userId = useUserId();
  const monthYear = '2024-09';
  const totalDays: number = getTotalWorkingDaysInCurrentMonth();
  console.log(totalDays);
  const {
    data: empdata,
    isLoading,
    isFetching,
  } = useEmployeeAttendance(userId);
  console.log('employeedata', empdata);
  const { data: attendanceReport } = useAttendanceReport(userId, monthYear);
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Card className="rounded-lg p-4 dark:bg-zinc-900">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-lg font-bold dark:text-white">
              Attendance
            </CardTitle>
            <a
              href="#"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              View Stats
            </a>
          </div>
        </CardHeader>

        <CardContent>
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
          <div className="flex items-center justify-between">
            <div>
              <Typography className="py-2 text-sm font-normal text-gray-500 dark:text-gray-300">
                <strong className="text-black dark:text-white">
                  {todayTotalHours}
                </strong>{' '}
                Total Hours
              </Typography>
              <Typography className="py-2 text-sm font-normal text-gray-500 dark:text-gray-300">
                <strong className="text-black dark:text-white">
                  {totalHoursOfWeek}
                </strong>{' '}
                Total Weekly Hours
              </Typography>
              <Typography className="py-2 text-sm font-normal text-gray-500 dark:text-gray-300">
                <strong className="text-black dark:text-white">
                  {todayStartTime}
                </strong>{' '}
                Today&apos;s Start Time
              </Typography>
            </div>
            <ProgressCircle
              value={noOfPresents}
              max={totalDays}
              strokeColor="#30BBF2"
              tooltipText="Presents"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg p-4 dark:bg-zinc-900">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-lg font-bold dark:text-white">
              Leave Records
            </CardTitle>
            <a
              href="#"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              View Stats
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
          <div className="flex items-center justify-between">
            <div>
              <Typography className="py-2 text-sm font-normal text-gray-500 dark:text-gray-300">
                <strong className="text-black dark:text-white">
                  {noOfPresents}
                </strong>{' '}
                Total Presents
              </Typography>
              <Typography className="py-2 text-sm font-normal text-gray-500 dark:text-gray-300">
                <strong className="text-black dark:text-white">
                  {noOfLeaves}
                </strong>{' '}
                Total Leaves
              </Typography>
              <Typography className="py-2 text-sm font-normal text-gray-500 dark:text-gray-300">
                <strong className="text-black dark:text-white">
                  {noOfAbsents}
                </strong>{' '}
                Total Absents
              </Typography>
            </div>
            <ProgressCircle
              value={noOfLeaves}
              max={totalDays}
              strokeColor="#10B981"
              tooltipText="Leaves"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeCard;
