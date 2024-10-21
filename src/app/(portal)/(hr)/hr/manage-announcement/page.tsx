'use client';
import { FunctionComponent, Suspense, useState } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import { AnnouncementDialog } from './components/AnnouncementDialog';
import HrAnnouncementTable from './components/HrAnnouncementTable';

interface HrManageAnnouncementmeProps {}

const HrManageAnnouncement: FunctionComponent<
  HrManageAnnouncementmeProps
> = () => {
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
      <LayoutHeader title="Manage Announcement">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <Suspense fallback={<div>Loading...</div>}>
          <HrAnnouncementTable handleDialogOpen={handleDialogOpen} />
        </Suspense>
      </LayoutWrapper>
      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
        mode="add"
      />
    </Layout>
  );
};

export default HrManageAnnouncement;
