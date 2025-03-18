'use client';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import moment from 'moment';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import { useAttendanceReport } from '@/hooks/employee/useAttendenceReport';
import { useUserId } from '@/hooks/employee/useUserId';

import RecentAnnouncements from './components/Announcement';
import { BChart } from './components/BarChart/BarChart';
import EmployeeCard from './components/Employeecard';
import UpcomingEvents from './components/UpcomingEvents';

interface EmployeeDashboardProps {}

const EmployeeDashboard: FunctionComponent<EmployeeDashboardProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const userId = useUserId();
  const from = moment(selectedDate?.from).format('YYYY-MM-DD');
  const to = moment(selectedDate?.to).format('YYYY-MM-DD');
  const { data: attendanceReport } = useAttendanceReport(userId, { from, to });
  const noOfPresents = attendanceReport?.noOfPresents || 0;
  const noOfLeaves = attendanceReport?.noOfLeaves || 0;
  const noOfAbsents = attendanceReport?.noOfAbsents || 0;

  const attendanceMessages = useMemo(() => {
    const messages = [];

    if (noOfAbsents > 0) {
      messages.push(
        `We missed you! You've been absent ${noOfAbsents} days—hope all is well!`,
      );
    } else if (noOfPresents > noOfAbsents) {
      messages.push(
        `You're on a roll! You've been present ${noOfPresents} days—keep up the great work!`,
      );
    } else if (noOfLeaves > noOfPresents) {
      messages.push(
        `Taking time off is important! You've taken ${noOfLeaves} leaves—stay refreshed and recharged!`,
      );
    }

    messages.push(
      `Attendance Spotlight: You've been present for ${noOfPresents} days, missed ${noOfAbsents} days, and ${
        noOfLeaves > 0
          ? `taken ${noOfLeaves} leave(s) to recharge`
          : "haven't taken any leave yet"
      }. Keep up the momentum!`,
    );

    messages.push(`Have a great day ahead!  Keep making an impact!`);

    messages.push(
      `Stay updated! Check out company announcements, upcoming events, and birthdays today.`,
    );

    return messages;
  }, [noOfPresents, noOfLeaves, noOfAbsents]);

  const [currentMessage, setCurrentMessage] = useState(attendanceMessages[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setCurrentMessage(attendanceMessages[index]);
      index = (index + 1) % attendanceMessages.length;
    }, 5000);

    return () => clearInterval(interval);
  }, [attendanceMessages]);

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Dashboard">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-5">
        <div className="m-0 p-0">
          <Header subheading={currentMessage}>
            <div className="flex flex-wrap">
              <DateRangePicker
                timeRange={timeRange}
                selectedDate={selectedDate}
                setTimeRange={setTimeRange}
                setDate={handleSetDate}
              />
            </div>
          </Header>
        </div>
        <div className="flex w-full flex-col items-stretch gap-4 align-middle lg:flex-row">
          <div className="flex size-full h-full flex-col gap-4 lg:w-2/3">
            <EmployeeCard attendanceReport={attendanceReport} />
            <div className="h-full flex-1">
              <BChart from={from} to={to} />
            </div>
          </div>

          <div className="grid size-full grid-cols-1 gap-4 md:grid-cols-2 lg:w-1/3 lg:grid-cols-1">
            <UpcomingEvents />
            <RecentAnnouncements />
          </div>
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default EmployeeDashboard;
