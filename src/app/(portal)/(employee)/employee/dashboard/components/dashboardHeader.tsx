import { useEffect, useState } from 'react';

import { ClockIcon } from 'lucide-react';

const DashboardHeader = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [user, setUser] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const authStorage = sessionStorage.getItem('auth-storage');
    if (authStorage) {
      const parsedStorage = JSON.parse(authStorage);
      const parsedUser = parsedStorage.state?.user;
      if (parsedUser) {
        setUser({
          firstName: parsedUser.firstName,
          lastName: parsedUser.lastName,
        });
      }
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-between rounded-md p-4 shadow-sm dark:bg-zinc-900 md:flex-row">
      <div className="md:flex md:flex-col">
        <h5 className="text-xl font-bold text-gray-900 dark:text-white md:text-lg">
          Good Afternoon, {user.firstName} {user.lastName}!
        </h5>
        <p className="text-sm text-gray-500 dark:text-gray-300 md:text-base">
          Your Personal Workplace Hub
        </p>
      </div>
      <div className="mt-4 flex w-full items-center justify-center rounded-lg bg-white p-2 shadow-sm dark:bg-zinc-900 md:ml-4 md:mt-0 md:w-auto">
        <div className="flex flex-col items-center md:items-end">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-300 md:text-base">
            Current time
          </span>
          <span className="text-lg font-bold text-black dark:text-white md:text-xl">
            {currentTime}
          </span>
        </div>
        <ClockIcon className="ml-28 text-gray-500 dark:text-gray-300" />
      </div>
    </div>
  );
};

export default DashboardHeader;
