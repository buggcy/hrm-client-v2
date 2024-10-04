'use client';
import React, { FunctionComponent, Suspense, useState } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import { Button } from '@/components/ui/button';

import { useAllPerkQuery } from '@/hooks/employee/usePerkList.hook';
import { useAuthStore } from '@/stores/auth';

import { PerkModal } from './component/PerkModal';
import PerkTable from './component/PerkTable';

interface PerkProps {}

const Perk: FunctionComponent<PerkProps> = () => {
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const { data } = useAllPerkQuery(userId as string, {
    enabled: !!userId,
  });
  const [modal, setModal] = useState(false);
  const [modelType, setModelType] = useState('add');

  const handleClose = () => {
    setModal(false);
  };

  const handleAdd = () => {
    setModelType('add');
    setModal(true);
  };

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Perks & Benefits">
        <LayoutHeaderButtonsBlock>
          <Button variant="default" onClick={handleAdd}>
            Apply for Perks
          </Button>
          <ReadDocsButton to="home" />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <Suspense fallback={<div>Loading...</div>}>
          {user && <PerkTable user={user} />}
        </Suspense>
      </LayoutWrapper>
      {user && (
        <PerkModal
          open={modal}
          onCloseChange={handleClose}
          type={modelType}
          user={user}
          perks={modelType === 'add' && Array.isArray(data) ? data : []}
          perkToEdit={null}
        />
      )}
    </Layout>
  );
};

export default Perk;
