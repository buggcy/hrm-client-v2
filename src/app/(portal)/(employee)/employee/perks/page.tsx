'use client';
import React, { FunctionComponent, useState } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import { Button } from '@/components/ui/button';

import { PerkModal } from './component/PerkModal';
import PerkTable from './component/PerkTable';

interface PerkProps {}

const Perk: FunctionComponent<PerkProps> = () => {
  const [modal, setModal] = useState(false);

  const handleOpen = () => {
    setModal(true);
  };

  const handleClose = () => {
    setModal(false);
  };
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Perks & Benefits">
        <LayoutHeaderButtonsBlock>
          <Button variant="default" onClick={handleOpen}>
            Apply for Perks
          </Button>
          <ReadDocsButton to="home" />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <PerkTable />
      </LayoutWrapper>
      <PerkModal open={modal} onCloseChange={handleClose} />
    </Layout>
  );
};

export default Perk;
