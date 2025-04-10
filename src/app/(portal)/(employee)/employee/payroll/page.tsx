'use client';
import { FunctionComponent, Suspense, useState } from 'react';

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

import PayrollTable from './components/PayrollTable';

interface PayrollProps {}

const Payroll: FunctionComponent<PayrollProps> = () => {
  const initialDate = moment().subtract(1, 'month').toDate();
  const [date, setDate] = useState<Date>(initialDate);

  const setDateValue = (selectedDate: Date | null) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  const month = moment(date).format('MM');
  const year = moment(date).format('YYYY');
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Payroll">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-6">
        <Header subheading="From Clock-In to Cash Out — Your Payroll Journey">
          <MonthPickerComponent
            setDateValue={setDateValue}
            initialDate={date}
            minDate={new Date(0, 0, 1)}
          />
        </Header>

        <Suspense fallback={<div>Loeading...</div>}>
          <PayrollTable month={month} year={year} />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default Payroll;
