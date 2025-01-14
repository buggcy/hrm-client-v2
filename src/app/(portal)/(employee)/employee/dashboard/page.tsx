'use client';
import { FunctionComponent, useState } from 'react';

import moment from 'moment';

import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { MonthPickerComponent } from '@/components/MonthPicker';
import { Notification } from '@/components/NotificationIcon';

import RecentAnnouncements from './components/Announcement';
import { BChart } from './components/BarChart/BarChart';
import EmployeeCard from './components/Employeecard';
import UpcomingEvents from './components/UpcomingEvents';
interface EmployeeDashboardProps {}

const EmployeeDashboard: FunctionComponent<EmployeeDashboardProps> = () => {
  const [date, setDate] = useState(new Date());
  const initialDate = date;
  const setDateValue = (date: Date | null) => {
    setDate(date || new Date());
  };
  const minAllowedDate = new Date(2000, 0, 1);
  const monthYear = moment(date).format('YYYY-MM');
  const formattedDate = moment(date).format('YYYY-MM-DD');

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
          <Header subheading="Have a good day ahead!">
            <div className="flex flex-wrap">
              <div className="flex flex-1 flex-col">
                <MonthPickerComponent
                  setDateValue={setDateValue}
                  initialDate={initialDate}
                  minDate={minAllowedDate}
                />
              </div>
            </div>
          </Header>
        </div>
        <div className="flex w-full flex-col items-stretch gap-4 align-middle lg:flex-row">
          <div className="flex size-full h-full flex-col gap-4 lg:w-2/3">
            <EmployeeCard monthYear={monthYear} />
            <div className="h-full flex-1">
              <BChart date={formattedDate} />
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
