'use client';
import React from 'react';

import Header from '@/components/Header/Header';
import { Layout, LayoutHeader, LayoutWrapper } from '@/components/Layout';

import { useApprovalEmployeeQuery } from '@/hooks/employee/useApprovalEmployee.hook';

import { ApprovalRequest } from '../manage-employees/ViewApprovalReq/ViewApprovalReq';

export default function ManageEmployeesPage() {
  const { data, refetch } = useApprovalEmployeeQuery();
  return (
    <Layout>
      <LayoutHeader title="Approval Requests"></LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1" className="max-w-full">
        <Header subheading="Review and Approve Employee Leave Requests"></Header>
        <div className="mt-4 grid h-full grid-cols-1 gap-6 lg:grid-cols-4">
          {data?.map(employee => (
            <ApprovalRequest
              key={employee?._id}
              data={employee}
              refetchApprovalList={refetch}
            />
          ))}
        </div>
      </LayoutWrapper>
    </Layout>
  );
}
