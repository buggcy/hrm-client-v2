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

import { useApprovalEmployeeQuery } from '@/hooks/employee/useApprovalEmployee.hook';

import UnApprovedEmployeeTable from './components/UnapprovedEmployee.component';
import { AddEmployeeDialog } from '../manage-employees/components/EmployeeModal';

export default function AddEmployeesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data } = useApprovalEmployeeQuery();

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  return (
    <Layout>
      <LayoutHeader title="Add Employees">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Header subheading="Creating a culture where people thrive and businesses grow.">
          <Button variant="default" onClick={handleDialogOpen}>
            Add Employee
          </Button>
          <Button variant="outline" asChild>
            <Link href="/hr/approval" className="flex items-center">
              View Approval Requests
              <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                {data?.length || 0}
              </span>
            </Link>
          </Button>
        </Header>
        <div className="my-6">
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
