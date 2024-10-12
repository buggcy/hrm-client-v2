'use client';
import React, { Suspense, useState } from 'react';

import { Bell } from 'lucide-react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Button } from '@/components/ui/button';

import { HrEventsDialogDemo } from './components/AddHrEventsDialog';
import HrEventsCalender from './components/HrEventsCalender';
import HrEventsTable from './components/HrEventsTable';

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
      <LayoutHeader title="Manage Events">
        <LayoutHeaderButtonsBlock>
          <Button variant="default" onClick={handleDialogOpen}>
            Add Event
          </Button>

          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="size-5" />
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1" className="space-y-5">
        <HrEventsCalender />
        <Suspense fallback={<div>Loading...</div>}>
          <HrEventsTable />
        </Suspense>
      </LayoutWrapper>
      <HrEventsDialogDemo
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
      />
    </Layout>
  );
}
