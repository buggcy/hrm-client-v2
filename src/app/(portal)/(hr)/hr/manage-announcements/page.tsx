'use client';
import { FunctionComponent, Suspense, useState } from 'react';

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

import { getWritePermissions } from '@/utils/permissions.utils';

import { AnnouncementDialog } from './components/AddAnnouncementDialog.component';
import ManageAnnouncementsCharts from './components/ManageAnnouncementsCharts.component';
import ManageAnnouncementTable from './components/ManageAnnouncementsTable.component';

interface ManageAnnouncementProps {}

const ManageAnnouncements: FunctionComponent<ManageAnnouncementProps> = () => {
  const writePermission = getWritePermissions('canWriteAnnouncements');
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Manage Announcements">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex w-full flex-col gap-8 px-2">
        <Header subheading="Managing announcements efficiently!">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
          {writePermission && (
            <Button
              variant="default"
              onClick={handleDialogOpen}
              disabled={!writePermission}
            >
              Add Announcement
            </Button>
          )}
        </Header>
        <ManageAnnouncementsCharts dates={selectedDate} />
        <Suspense fallback={<div>Loading...</div>}>
          <ManageAnnouncementTable dates={selectedDate} />
        </Suspense>
      </LayoutWrapper>
      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
      />
    </Layout>
  );
};

export default ManageAnnouncements;
