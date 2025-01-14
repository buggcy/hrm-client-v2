'use client';
import { FunctionComponent, useState } from 'react';

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

import HrDashboardCharts from './components/HrDashboardCharts';

interface HrDashboardmeProps {}

const HrDashboardme: FunctionComponent<HrDashboardmeProps> = () => {
  const [date, setDate] = useState(new Date());
  const initialDate = date;
  const setDateValue = (date: Date | null) => {
    setDate(date || new Date());
  };
  const minAllowedDate = new Date(2000, 0, 1);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Dashboard">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8">
        <Header subheading="Manage your employees, attendance, and more.">
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
        <HrDashboardCharts month={month} year={year} />
      </LayoutWrapper>
    </Layout>
  );
};

export default HrDashboardme;
