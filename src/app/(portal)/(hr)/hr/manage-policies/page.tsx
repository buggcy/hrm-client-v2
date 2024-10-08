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

import { PolicyDialog } from './components/AddPolicyModal';
import PolicyTable from './components/PolicyTable.components';

export default function ManagePoliciesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const category: string = '';

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Layout>
      <LayoutHeader title="Manage Policies">
        <LayoutHeaderButtonsBlock>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="size-5" />
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <Suspense fallback={<div>Loading...</div>}>
          <PolicyTable
            category={category}
            handleDialogOpen={handleDialogOpen}
          />
        </Suspense>
      </LayoutWrapper>
      <PolicyDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
      />
    </Layout>
  );
}
