'use client';
import { FunctionComponent, Suspense } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import { fetchAnnouncements } from '@/services/hr/announcement.service';

import HrAnnouncementTable from './components/HrAnnouncementTable';

interface HrManageAnnouncementmeProps {}

const HrManageAnnouncement: FunctionComponent<
  HrManageAnnouncementmeProps
> = () => {
  const data = fetchAnnouncements();
  console.log(data);
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
          <HrAnnouncementTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default HrManageAnnouncement;
