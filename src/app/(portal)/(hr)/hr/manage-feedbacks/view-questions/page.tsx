'use client';
import { Suspense } from 'react';

import { Bell } from 'lucide-react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Button } from '@/components/ui/button';

import QuestionAnswerTypeTable from '../component/QuestionAnswerTable';

export default function ManageLeavePage() {
  return (
    <Layout>
      <LayoutHeader title="View Questions">
        <LayoutHeaderButtonsBlock>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="size-5" />
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <QuestionAnswerTypeTable />
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
}
