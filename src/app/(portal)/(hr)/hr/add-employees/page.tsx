'use client';
import React, { Suspense, useState } from 'react';
import Link from 'next/link';

import Header from '@/components/Header/Header';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Button } from '@/components/ui/button';
import { useStores } from '@/providers/Store.Provider';

import {
  useApprovalEmployeeQuery,
  useDeviceChart,
  useEmployeeApprovalStatsQuery,
} from '@/hooks/employee/useApprovalEmployee.hook';
import { AuthStoreType } from '@/stores/auth';
import { getWritePermissions } from '@/utils/permissions.utils';

import AddEmpCards from './components/AddEmpCards';
import UnApprovedEmployeeTable from './components/UnapprovedEmployee.component';
import { AddEmployeeDialog } from '../manage-employees/components/EmployeeModal';

export default function AddEmployeesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data } = useApprovalEmployeeQuery();
  const { data: deviceChart } = useDeviceChart();

  const { data: hrEmployeeApprovalStats } = useEmployeeApprovalStatsQuery();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const addPermission = getWritePermissions('canWriteEmployees');

  return (
    <Layout>
      <LayoutHeader title="Add Employees">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Header
          subheading={`Shape your dream team with ease! Keep your hiring process seamless!`.trim()}
        >
          {addPermission && (
            <Button
              variant="default"
              onClick={handleDialogOpen}
              disabled={!addPermission}
            >
              Add Employee
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link
              href={user?.roleId === 1 ? '/hr/approval' : '/manager/approval'}
              className="flex items-center"
            >
              View Approval Requests
              <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                {data?.length || 0}
              </span>
            </Link>
          </Button>
        </Header>
        <div className="my-6 flex flex-col gap-5">
          <AddEmpCards
            data={hrEmployeeApprovalStats}
            deviceChart={deviceChart}
          />
          <Suspense fallback={<div>Loading...</div>}>
            <UnApprovedEmployeeTable />
          </Suspense>
        </div>
      </LayoutWrapper>
      <AddEmployeeDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
      />
    </Layout>
  );
}
