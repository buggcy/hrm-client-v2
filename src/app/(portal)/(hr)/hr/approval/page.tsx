'use client';
import React from 'react';

import { Layout, LayoutHeader, LayoutWrapper } from '@/components/Layout';

import { ApprovalRequest } from '../manage-employees/ViewApprovalReq/ViewApprovalReq';

export default function ManageEmployeesPage() {
  return (
    <Layout>
      <LayoutHeader title="Approval Requests"></LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1" className="max-w-full">
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-4">
          <ApprovalRequest />
          <ApprovalRequest />
          <ApprovalRequest />
          <ApprovalRequest />
          <ApprovalRequest />
          <ApprovalRequest />
          <ApprovalRequest />
          <ApprovalRequest />
        </div>
      </LayoutWrapper>
    </Layout>
  );
}
