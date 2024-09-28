'use client';

import { useState } from 'react';

import { EmployeeListType } from '@/libs/validations/employee';

import { ApprovalCard } from '../../approval/ApprovalCard/ApprovalCard';

export const description = 'A pie chart with a custom label';

export function ApprovalRequest({
  data,
  refetchApprovalList,
}: {
  data: EmployeeListType;
  refetchApprovalList: () => void;
}) {
  const [selected, setSelected] = useState(false);
  const [isLoading] = useState(false);

  const handleSelect = () => {
    setSelected(!selected);
  };

  const handleJoin = (id: string) => {
    console.log('Join Now clicked for persona id:', id);
  };
  return (
    <div>
      <ApprovalCard
        refetchApprovalList={refetchApprovalList}
        person={data}
        selected={selected}
        isSelectable={true}
        handleSelect={handleSelect}
        onClick={handleJoin}
        isLoading={isLoading}
      />
    </div>
  );
}
