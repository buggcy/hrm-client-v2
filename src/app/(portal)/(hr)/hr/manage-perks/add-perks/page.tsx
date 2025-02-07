'use client';
import { FunctionComponent, Suspense } from 'react';
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

import { AuthStoreType } from '@/stores/auth';

import AddPerksForm from './components/AddPerksForm';
import HrPerksListTable from './components/HrPerksListTable.component';

interface AddPerksProps {}

const AddPerksPage: FunctionComponent<AddPerksProps> = () => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const router = useRouter();
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
            variant="default"
            onClick={() =>
              router.push(
                `/${user?.roleId === 3 ? 'manager' : 'hr'}/manage-perks/award-perks`,
              )
            }
          >
            Assign Perks
          </Button>
        </Header>
        <AddPerksForm />
        <Suspense fallback={<div>Loading...</div>}>
          <HrPerksListTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default AddPerksPage;
