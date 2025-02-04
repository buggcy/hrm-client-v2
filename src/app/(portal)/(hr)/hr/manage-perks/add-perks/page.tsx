'use client';
import { FunctionComponent, Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';

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
import { useStores } from '@/providers/Store.Provider';

import { useHrPerkRequestsQuery } from '@/hooks/hrPerksList/useHrPerksList.hook';
import { AuthStoreType } from '@/stores/auth';

import { AddPerksDialog } from './components/AddPerksDialog';
import HrPerksListTable from './components/HrPerksListTable.component';

interface AddPerksProps {}

const AddPerksPage: FunctionComponent<AddPerksProps> = () => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();
  const { data: perkRequests } = useHrPerkRequestsQuery({});

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Perks & Benefits">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8 px-2">
        <Header subheading="Empower your team with perks that inspire and benefits that last.">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() =>
              router.push(
                `/${user?.roleId === 3 ? 'manager' : 'hr'}/manage-perks/perk-requests`,
              )
            }
          >
            View Approval Requests
            <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
              {perkRequests?.data.length || 0}
            </span>
          </Button>
          <Button
            variant="default"
            onClick={() =>
              router.push(
                `/${user?.roleId === 3 ? 'manager' : 'hr'}/manage-perks/award-perks`,
              )
            }
          >
            Assign Perks
          </Button>
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
