'use client';
import React, { useState } from 'react';

import { Bell } from 'lucide-react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Button } from '@/components/ui/button';

import { BChart } from './BarChart/BarChart';
import { DialogDemo } from './components/EmployeeModal';
import { PChart } from './PieChart/PieChart';

export default function ManageEmployeesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

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
            <a href="/approval" className="flex items-center">
              View Approval Requests
              <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                3
              </span>
            </a>
          </Button>

          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="size-5" />
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1" className="max-w-full">
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
          <BChart /> <PChart />
        </div>
      </LayoutWrapper>
      <DialogDemo open={dialogOpen} onOpenChange={handleDialogClose} />
    </Layout>
  );
}
