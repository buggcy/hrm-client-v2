'use client';
import React, { Suspense, useEffect } from 'react';

import Header from '@/components/Header/Header';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { useStores } from '@/providers/Store.Provider';

import { useEmployeeApprovalStatsQuery } from '@/hooks/employee/useApprovalEmployee.hook';
import {
  defaultParams,
  useHrDashboardStatsQuery,
} from '@/hooks/hr/useDasdhboard.hook';
import { EmployeeStoreType } from '@/stores/hr/employee';

import ChartsPage from './components/ChartsPage';
import EmployeeTable from './components/EmployeeTable.component';

export default function ManageEmployeesPage() {
  const { employeeStore } = useStores() as { employeeStore: EmployeeStoreType };
  const { setRefetchEmployeeList, refetchEmployeeList } = employeeStore;
  const { data: hrDashboardStats, refetch: RefetchDashboard } =
    useHrDashboardStatsQuery(defaultParams);
  const { data: hrEmployeeApprovalStats, refetch: RefetchEmployee } =
    useEmployeeApprovalStatsQuery();
  useEffect(() => {
    if (refetchEmployeeList) {
      void (async () => {
        await RefetchDashboard();
        await RefetchEmployee();
      })();

      setRefetchEmployeeList(false);
    }
  }, [
    refetchEmployeeList,
    setRefetchEmployeeList,
    RefetchDashboard,
    RefetchEmployee,
  ]);
  return (
    <Layout>
      <LayoutHeader title="Manage Employees">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Header
          subheading={`Leading a dynamic team of ${Number(hrDashboardStats?.employeeCount?.fullTime || 0) + Number(hrDashboardStats?.employeeCount?.intern || 0)} professionals—drive efficiency, streamline operations, and empower your workforce like never before!`}
        ></Header>
        <div className="mb-6">
          <ChartsPage
            hrDashboardStats={hrDashboardStats?.employeeCount}
            hrEmployeeApprovalStats={hrEmployeeApprovalStats?.employeeChart}
          />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <EmployeeTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
