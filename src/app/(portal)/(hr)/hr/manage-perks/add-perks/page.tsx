'use client';
import { FunctionComponent, Suspense, useState } from 'react';

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

import { AddPerksDialog } from './components/AddPerksDialog';
import HrPerksListTable from './components/HrPerksListTable.component';

interface AddPerksProps {}

const AddPerksPage: FunctionComponent<AddPerksProps> = () => {
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
      <LayoutHeader title="Add Perks">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8 px-2">
        <Header subheading="Managing and assigning your perks efficiently!">
          <Button variant="default" onClick={handleDialogOpen}>
            Add Perk
          </Button>
        </Header>
        <Suspense fallback={<div>Loading...</div>}>
          <HrPerksListTable />
        </Suspense>
      </LayoutWrapper>
      <AddPerksDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
      />
    </Layout>
  );
};

export default AddPerksPage;
