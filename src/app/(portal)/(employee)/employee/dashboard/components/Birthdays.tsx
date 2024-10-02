'use client';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';

import { useUpcomingBirthdays } from '@/hooks/employee/useUpcomingBirthdays.hook';

import { Birthday } from '@/types/Birthday.types';

const BirthdaysUpcoming = () => {
  const { data: birthdayData, isLoading, error } = useUpcomingBirthdays();
  const upcomingBirthdays = isLoading || error ? [] : birthdayData?.data || [];

  return (
    <Card className="rounded-lg border p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Upcoming Birthdays
        </CardTitle>
        <span className="items-center rounded-xl border-red-100 bg-primary px-3 py-1 text-center text-sm text-white">
          {upcomingBirthdays.length} Upcoming
        </span>
      </div>

      <div className="mb-6 max-h-28 space-y-4 overflow-y-auto">
        {upcomingBirthdays.map((employee: Birthday) => (
          <div key={employee.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                {employee.Avatar ? (
                  <img
                    src={employee.Avatar}
                    alt={`${employee.firstName} ${employee.lastName}`}
                    className="size-8 rounded-full"
                  />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-400 text-white">
                    {employee.firstName[0]}
                    {employee.lastName[0]}
                  </div>
                )}
              </Avatar>
              <div>
                <p className="font-medium">
                  {employee.firstName} {employee.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(employee.DOB).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {upcomingBirthdays.length === 0 && (
        <p className="text-center text-gray-500">No upcoming birthdays</p>
      )}

      <Button
        variant="secondary"
        className="w-full bg-blue-100 text-primary hover:bg-none"
      >
        Wish Him Birthday!
      </Button>
    </Card>
  );
};

export default BirthdaysUpcoming;
