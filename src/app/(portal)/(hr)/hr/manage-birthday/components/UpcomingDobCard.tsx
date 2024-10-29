import React from 'react';

import { User } from 'lucide-react';

import { Card } from '@/components/ui/card';

import { useEmployeeDobChartQuery } from '@/hooks/EmployeeDobTable/useEmpDob.hook';

interface Employee {
  DOB: Date;
  Joining_Date: Date;
  firstName: string;
  lastName: string;
  remainingDays: number;
  _id: string;
}

const UpcomingDobCard: React.FC = () => {
  const { data: myData, isError } = useEmployeeDobChartQuery();

  const today = new Date();

  const upcomingDobs: Employee[] =
    myData?.map((employee: Employee) => ({
      DOB: employee.DOB,
      Joining_Date: employee.Joining_Date,
      firstName: employee.firstName,
      lastName: employee.lastName,
      remainingDays: employee.remainingDays,
      _id: employee._id,
    })) || [];

  const getUpcomingDobs = () => {
    const todayDOBs: Employee[] = [];
    const upcomingDOBs: Employee[] = [];

    upcomingDobs.forEach(employee => {
      const dobDate = new Date(employee.DOB);
      const nextBirthday = new Date(
        today.getFullYear(),
        dobDate.getMonth(),
        dobDate.getDate(),
      );

      if (nextBirthday.toDateString() === today.toDateString()) {
        todayDOBs.push(employee);
      } else if (nextBirthday > today) {
        upcomingDOBs.push(employee);
      }
    });

    upcomingDOBs.sort((a, b) => {
      const aNextBirthday = new Date(
        today.getFullYear(),
        new Date(a.DOB).getMonth(),
        new Date(a.DOB).getDate(),
      );
      const bNextBirthday = new Date(
        today.getFullYear(),
        new Date(b.DOB).getMonth(),
        new Date(b.DOB).getDate(),
      );
      return aNextBirthday.getTime() - bNextBirthday.getTime();
    });

    return [...todayDOBs, ...upcomingDOBs].slice(0, 3);
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
      <h2 className="mb-4 text-lg font-bold">Upcoming Birthdays</h2>
      {displayDobs.length === 0 ? (
        <p>No upcoming birthdays this month.</p>
      ) : (
        <ul className="space-y-2">
          {displayDobs.map(employee => {
            const dobDate = new Date(employee.DOB);
            const nextBirthday = new Date(
              today.getFullYear(),
              dobDate.getMonth(),
              dobDate.getDate(),
            );
            const isToday =
              nextBirthday.toDateString() === today.toDateString();
            const isTomorrow =
              nextBirthday.getDate() === today.getDate() + 1 &&
              nextBirthday.getMonth() === today.getMonth();

            return (
              <li key={employee._id} className="flex items-center border-b p-2">
                <User className="mr-2 text-blue-500" />{' '}
                <div>
                  <p className="text-[14px] font-semibold">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p className="text-[12px] text-gray-500">
                    {dobDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    })}{' '}
                    -
                    {isToday
                      ? ' Today'
                      : isTomorrow
                        ? ' Tomorrow'
                        : ` ${employee.remainingDays - 1} days remaining`}
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

export default UpcomingDobCard;
