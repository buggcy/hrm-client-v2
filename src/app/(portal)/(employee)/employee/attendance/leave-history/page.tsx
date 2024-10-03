'use client';
import { FunctionComponent, Suspense, useState } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { MonthPickerComponent } from '@/components/MonthPicker';
import { ReadDocsButton } from '@/components/ReadDocsButton';

import LeaveHistoryPage from './leaveHistory';

interface LeaveHistoryProps {}

const LeaveHistory: FunctionComponent<LeaveHistoryProps> = () => {
  const [date, setDate] = useState(new Date());
  const initialDate = new Date();

  const setDateValue = (date: Date | null) => {
    setDate(date || new Date());
  };

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Leave">
        <LayoutHeaderButtonsBlock>
          <MonthPickerComponent
            setDateValue={setDateValue}
            initialDate={initialDate}
          />
          <ReadDocsButton to="home" />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <LeaveHistoryPage date={date} />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default LeaveHistory;
