import { FunctionComponent, Suspense } from 'react';

import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import PayrollCards from './components/PayrollCards';
import PayrollTable from './components/PayrollTable';

interface PayrollProps {}

const Payroll: FunctionComponent<PayrollProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Payroll">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-6">
        <Header subheading="From Clock-In to Cash Out — Your Payroll Journey"></Header>
        <PayrollCards />
        <Suspense fallback={<div>Loeading...</div>}>
          <PayrollTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default Payroll;
