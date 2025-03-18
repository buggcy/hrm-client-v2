'use client';

import React, { Suspense, useState } from 'react';

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
import { Button } from '@/components/ui/button';

import { usePayrollStatisticsQuery } from '@/hooks/hr/useHrPayroll.hook';
import { formatedDate } from '@/utils';

import { RefreshPayrollDialog } from './component/Model/RefreshModel';
import PayrollCard from './component/PayrollCard';
import PayrollTable from './components/PayrollTable.component';

export default function ManagePayrollPage() {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const [RefreshDialogOpen, setRefreshDialogOpen] = useState(false);
  const { data: payrollStats } = usePayrollStatisticsQuery({
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
  });
  const handleRefreshDialogOpen = () => {
    setRefreshDialogOpen(true);
  };

  const handleRefreshDialogClose = () => {
    setRefreshDialogOpen(false);
  };
  return (
    <>
      <Layout>
        <HighTrafficBanner />
        <LayoutHeader title="Manage Payroll">
          <LayoutHeaderButtonsBlock>
            <Notification />
          </LayoutHeaderButtonsBlock>
        </LayoutHeader>
        <LayoutWrapper wrapperClassName="flex flex-1">
          <Header
            subheading={`Powering paydays with precision! ${
              (payrollStats?.records?.totalPaid || 0) > 0
                ? `${payrollStats?.records?.totalPaid} salaries processed,`
                : ''
            }${
              (payrollStats?.records?.totalUnpaid || 0) > 0
                ? ` ${payrollStats?.records?.totalUnpaid} awaiting disbursement`
                : ''
            }${
              (payrollStats?.records?.totalPaidAmount || 0) > 0
                ? `, $${payrollStats?.records?.totalPaidAmount} paid`
                : ''
            }${
              (payrollStats?.records?.totalAmountTobePaid || 0) > 0
                ? `, $${payrollStats?.records?.totalAmountTobePaid} pending`
                : ''
            }${
              (payrollStats?.records?.totalSalaryDeduction || 0) > 0
                ? `, $${payrollStats?.records?.totalSalaryDeduction} deductions applied`
                : ''
            }. Keep payroll seamless and employees motivated!`.trim()}
          >
            <DateRangePicker
              timeRange={timeRange}
              selectedDate={selectedDate}
              setTimeRange={setTimeRange}
              setDate={handleSetDate}
            />
            <Button size={'sm'} onClick={handleRefreshDialogOpen}>
              Refresh Payroll
            </Button>
          </Header>
          <div className="mt-6">
            <Suspense fallback={<div>Loading...</div>}>
              <PayrollCard payrollStats={payrollStats} />
            </Suspense>
          </div>

          <div className="mt-6">
            <Suspense fallback={<div>Loading...</div>}>
              <PayrollTable dates={selectedDate} />
            </Suspense>
          </div>
        </LayoutWrapper>
      </Layout>
      <RefreshPayrollDialog
        open={RefreshDialogOpen}
        onOpenChange={handleRefreshDialogClose}
        onCloseChange={handleRefreshDialogClose}
      />
    </>
  );
}
