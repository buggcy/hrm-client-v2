import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useEmployeeDobChartQuery } from '@/hooks/EmployeeDobTable/useEmpDob.hook';

interface Employee {
  DOB: Date;
  Joining_Date?: Date | null;
  firstName: string;
  lastName: string;
  Avatar?: string;
  remainingDays: number;
  _id: string;
}

const UpcomingDobCard: React.FC = () => {
  const { data: myData, isError } = useEmployeeDobChartQuery();

  const today = new Date();

  const upcomingDobs: Employee[] =
    myData?.map((employee: Employee) => ({
      DOB: employee.DOB,
      Joining_Date: employee?.Joining_Date,
      firstName: employee.firstName,
      lastName: employee.lastName,
      remainingDays: employee.remainingDays,
      Avatar: employee?.Avatar || '',
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
    <Card className="h-[340px] w-1/5 overflow-y-auto rounded-md bg-white p-4 shadow dark:bg-zinc-900 dark:text-white max-lg:w-full">
      <h2 className="mb-4 text-lg font-bold">Upcoming Birthdays</h2>
      {displayDobs.length === 0 ? (
        <p className="text-sm text-gray-600">
          No upcoming birthdays this month.
        </p>
      ) : (
        <ul className="space-y-2">
          <ScrollArea className="h-60 w-full">
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
              const initials = `${employee?.firstName?.charAt(0) || ''}${employee.lastName?.charAt(0) || ''}`;
              return (
                <li
                  key={employee._id}
                  className="flex items-center border-b p-2"
                >
                  <div className="mr-2 flex items-center">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={employee?.Avatar || ''}
                        alt={`${employee.firstName} ${employee.lastName}`}
                      />
                      <AvatarFallback className="uppercase">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
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
          </ScrollArea>
        </ul>
      )}
    </Card>
  );
};

export default UpcomingDobCard;
