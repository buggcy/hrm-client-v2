'use client';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';

const BirthdaysUpcoming = () => {
  return (
    <Card className="rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Upcoming Birthdays
        </CardTitle>
        <span className="rounded-full bg-blue-500 px-5 py-1 text-sm text-white">
          Available
        </span>
      </div>

      <div className="flex items-center justify-center gap-10 py-6">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-blue-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 12.75V21a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 21v-8.25M21.75 9v-.75A2.25 2.25 0 0019.5 6H4.5A2.25 2.25 0 002.25 8.25V9M9.75 9v-.75a1.5 1.5 0 113 0V9M6.75 15a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm7.5 0a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75z"
              />
            </svg>
          </div>
          <p className="mt-2 text-lg font-bold">24</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-full bg-blue-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 12.75V21a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 21v-8.25M21.75 9v-.75A2.25 2.25 0 0019.5 6H4.5A2.25 2.25 0 002.25 8.25V9M9.75 9v-.75a1.5 1.5 0 113 0V9M6.75 15a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm7.5 0a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75z"
              />
            </svg>
          </div>
          <p className="text-lg font-bold">12</p>
          <p className="text-sm text-gray-500">Available</p>
        </div>
      </div>

      <Button className="mt-4 w-full bg-blue-100 text-blue-500 hover:bg-blue-200">
        Wish a Birthday
      </Button>
    </Card>
  );
};

export default BirthdaysUpcoming;
