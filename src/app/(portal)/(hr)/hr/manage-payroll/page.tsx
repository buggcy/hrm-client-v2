'use client';

import React, { Suspense, useEffect, useState } from 'react';

import { Banknote, EllipsisVertical, RefreshCw } from 'lucide-react';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { usePayrollStatisticsQuery } from '@/hooks/hr/useHrPayroll.hook';
import { useHRPayrollListQuery } from '@/hooks/payroll/useHRPayroll.hook';
import { formatedDate } from '@/utils';

import { GeneratePayrollDialog } from './component/Model/GeneratePayroll';
import { RefreshPayrollDialog } from './component/Model/RefreshModel';
import PayrollCard from './component/PayrollCard';
import PayrollTable from './components/PayrollTable.component';

export default function ManagePayrollPage() {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange('Payroll');
  const currentDate = new Date().getDate();
  const [RefreshDialogOpen, setRefreshDialogOpen] = useState(false);
  const [isGenerate, setIsGenerate] = useState<boolean>(false);
  const { data: payrollStats, refetch: refetchStats } =
    usePayrollStatisticsQuery({
      from: formatedDate(selectedDate?.from),
      to: formatedDate(selectedDate?.to),
    });
  const { data: payrollList, refetch } = useHRPayrollListQuery({
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
  });
  const [hasPayrollData, setHasPayrollData] = useState<boolean>(false);

  useEffect(() => {
    if (payrollList?.data && payrollList.data.length > 0) {
      setHasPayrollData(true);
    } else {
      setHasPayrollData(false);
    }
  }, [payrollList]);

  const handleRefreshDialogOpen = () => {
    setRefreshDialogOpen(true);
  };

  const handleRefreshDialogClose = () => {
    setRefreshDialogOpen(false);
  };
  const handleOpen = () => {
    setIsGenerate(true);
  };

  const handleClose = () => {
    setIsGenerate(false);
  };
  const refetchAll = async () => {
    await Promise.all([refetch(), refetchStats()]);
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
            subheading={`Seamless Payroll Management: Refresh, Generate, and Track with Confidence!`}
          >
            <DateRangePicker
              timeRange={timeRange}
              selectedDate={selectedDate}
              setTimeRange={setTimeRange}
              setDate={handleSetDate}
            />
            {currentDate <= 5 ? (
              <Button size={'sm'} onClick={handleOpen}>
                Generate Payroll
              </Button>
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="relative px-2 py-1">
                  <EllipsisVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem
                  onClick={handleRefreshDialogOpen}
                  className="flex flex-row gap-1"
                >
                  <RefreshCw size={16} />
                  <span className="lg:block">Refresh Payroll</span>
                </DropdownMenuItem>
                {!(currentDate <= 5) && (
                  <DropdownMenuItem
                    className="flex flex-row gap-1"
                    onClick={handleOpen}
                  >
                    <Banknote size={16} />
                    <span className="lg:block">Generate Payroll</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
        refetch={refetchAll}
      />
      <GeneratePayrollDialog
        open={isGenerate}
        onOpenChange={handleClose}
        onCloseChange={handleClose}
        hasData={hasPayrollData}
        refetch={refetchAll}
      />
    </>
  );
}
