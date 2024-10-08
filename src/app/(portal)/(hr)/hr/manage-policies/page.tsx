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

import { useFetchAllCategories } from '@/hooks/usepolicyQuery';

import { PolicyDialog } from './components/AddPolicyModal';
import PolicyTable from './components/PolicyTable.components';

export default function ManagePoliciesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('All Policy Category');

  const { data, isLoading, error } = useFetchAllCategories();

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleCategoryChange = (selectedCategory: string, newTitle: string) => {
    setCategory(selectedCategory);
    setTitle(newTitle);
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
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <PolicyTable
            category={category}
            handleDialogOpen={handleDialogOpen}
            title={title}
            setTitle={setTitle}
            data={data}
            isLoading={isLoading}
            error={error}
            handleCategoryChange={handleCategoryChange}
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
