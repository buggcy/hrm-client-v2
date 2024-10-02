'use client';
import React, { Suspense, useState } from 'react';
import Link from 'next/link';

import { Bell } from 'lucide-react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Button } from '@/components/ui/button';

import { useApprovalEmployeeQuery } from '@/hooks/employee/useApprovalEmployee.hook';

import { BChart } from './BarChart/BarChart';
import { DialogDemo } from './components/EmployeeModal';
import EmployeeTable from './components/EmployeeTable.component';
import { PChart } from './PieChart/PieChart';

export default function ManageEmployeesPage() {
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
      <LayoutHeader title="Manage Employees">
        <LayoutHeaderButtonsBlock>
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

          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="size-5" />
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BChart /> <PChart />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <EmployeeTable />
        </Suspense>
      </LayoutWrapper>
      <DialogDemo
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
      />
    </Layout>
  );
}
