'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import Header from '@/components/Header/Header';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Button } from '@/components/ui/button';

import EmptyCard from '@/app/(authentication)/auth/register/components/emptyCard';
import { useApprovalEmployeeQuery } from '@/hooks/employee/useApprovalEmployee.hook';

import { ApprovalRequest } from '../manage-employees/ViewApprovalReq/ViewApprovalReq';

export default function ManageEmployeesPage() {
  const { data, refetch } = useApprovalEmployeeQuery();
  const router = useRouter();

  return (
    <Layout>
      <LayoutHeader
        title="Approval Requests"
        leftElement={
          <Button
            variant="outline"
            size="icon"
            aria-label="Go Back"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 p-1"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-5" />
          </Button>
        }
      >
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1" className="max-w-full">
        <Header subheading="Review and Approve Employee Leave Requests"></Header>
        <div className="mt-4 grid h-full grid-cols-1 gap-6 lg:grid-cols-4">
          {data && data.length > 0 ? (
            data?.map(employee => (
              <ApprovalRequest
                key={employee?._id}
                data={employee}
                refetchApprovalList={refetch}
              />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center">
              <EmptyCard message="Approval Requests" />
            </div>
          )}
        </div>
      </LayoutWrapper>
    </Layout>
  );
}
