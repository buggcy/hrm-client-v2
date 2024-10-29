'use client';
import React, { Suspense, useState } from 'react';

import { Bell } from 'lucide-react';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
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
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

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
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="size-5" />
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1" className="space-y-5">
        <Header subheading="Engaging Our Team: Celebrations and Activities Year-Round!">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
          <Button variant="default" onClick={handleDialogOpen}>
            Add Event
          </Button>
        </Header>
        <HrEventsCalender />
        <Suspense fallback={<div>Loading...</div>}>
          <HrEventsTable dates={selectedDate} />
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
