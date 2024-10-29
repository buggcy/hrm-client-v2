import React from 'react';

import { User } from 'lucide-react';

import { Card } from '@/components/ui/card';

import { useEmployeeDobChartQuery } from '@/hooks/EmployeeDobTable/useEmpDob.hook';

interface Employee {
  remainingDays: number;
  DOB: Date;
  Joining_Date: Date;
  firstName: string;
  lastName: string;
  _id: string;
}

const UpcomingAnniversaryCard: React.FC = () => {
  const { data: myData, isError } = useEmployeeDobChartQuery();
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const getRemainingDays = (joiningDate: Date) => {
    const anniversaryDate = new Date(
      today.getFullYear(),
      joiningDate.getMonth(),
      joiningDate.getDate(),
    );

    if (anniversaryDate < today) {
      anniversaryDate.setFullYear(today.getFullYear() + 1);
    }

    const diffInTime = anniversaryDate.getTime() - today.getTime();
    return Math.ceil(diffInTime / (1000 * 3600 * 24));
  };

  const upcomingDobs: Employee[] =
    myData?.map((employee: Employee) => {
      const remainingDays = getRemainingDays(new Date(employee.Joining_Date));
      return {
        DOB: employee.DOB,
        Joining_Date: employee.Joining_Date,
        firstName: employee.firstName,
        lastName: employee.lastName,
        _id: employee._id,
        remainingDays,
      };
    }) || [];

  const getUpcomingDobs = () => {
    const upcomingAnniversaries: Employee[] = [];

    upcomingDobs.forEach(employee => {
      if (employee.remainingDays >= 0) {
        upcomingAnniversaries.push(employee);
      }
    });

    upcomingAnniversaries.sort((a, b) => a.remainingDays - b.remainingDays);

    return upcomingAnniversaries.slice(0, 3);
  };

  const displayDobs = getUpcomingDobs();

  if (isError) {
    return (
      <Card className="rounded-md bg-white p-4 shadow">
        Error loading data.
      </Card>
    );
  }

  return (
    <Card className="h-[330px] w-1/5 overflow-y-auto rounded-md bg-white p-4 shadow dark:bg-zinc-900 dark:text-white max-lg:w-full">
      <h2 className="mb-4 text-lg font-bold">Upcoming Anniversarys</h2>
      {displayDobs.length === 0 ? (
        <p>No upcoming anniversaries this month.</p>
      ) : (
        <ul className="space-y-2">
          {displayDobs.map(employee => {
            const remainingDays = employee.remainingDays;
            const isToday = remainingDays === 0;
            const isTomorrow = remainingDays === 1;

            return (
              <li key={employee._id} className="flex items-center border-b p-2">
                <User className="mr-2 text-blue-500" />
                <div>
                  <p className="text-[14px] font-semibold">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p className="text-[12px] text-gray-500">
                    {new Date(employee.Joining_Date).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                      },
                    )}{' '}
                    -
                    {isToday
                      ? ' Today'
                      : isTomorrow
                        ? ' Tomorrow'
                        : ` ${remainingDays - 1} days remaining`}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

export default UpcomingAnniversaryCard;
