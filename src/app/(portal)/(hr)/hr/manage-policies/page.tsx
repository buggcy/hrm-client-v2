'use client';
import React, { Suspense, useState } from 'react';

import { BadgePlus, Bell, ChevronDown, ChevronUp } from 'lucide-react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useFetchAllCategories } from '@/hooks/usepolicyQuery';

import { PolicyDialog } from './components/AddPolicyModal';
import PolicyTable from './components/PolicyTable.components';

export default function ManagePoliciesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('All Policy Category');

  const { data, isLoading, error } = useFetchAllCategories();
  console.log('Categories from hook:', data?.categories);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCategoryChange = (selectedCategory: string, newTitle: string) => {
    setCategory(selectedCategory);
    setTitle(newTitle);
  };

  return (
    <Layout>
      <LayoutHeader title="Manage Policies">
        <LayoutHeaderButtonsBlock>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" onClick={toggleDropdown}>
                {title}
                {dropdownOpen ? (
                  <ChevronUp className="ml-2 size-4" />
                ) : (
                  <ChevronDown className="ml-2 size-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                onClick={() => handleCategoryChange('', 'All Policy Category')}
              >
                All Categories
              </DropdownMenuItem>
              {isLoading ? (
                <DropdownMenuItem disabled>
                  Loading categories...
                </DropdownMenuItem>
              ) : error ? (
                <DropdownMenuItem disabled>
                  Error loading categories
                </DropdownMenuItem>
              ) : data ? (
                data.categories.map((cat: string) => (
                  <DropdownMenuItem
                    key={cat}
                    onClick={() => handleCategoryChange(cat, cat)}
                  >
                    {cat}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No categories available
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleDialogOpen}>
            <BadgePlus className="mr-2 size-4" /> Add Policy
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="size-5" />
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <PolicyTable category={category} />
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
