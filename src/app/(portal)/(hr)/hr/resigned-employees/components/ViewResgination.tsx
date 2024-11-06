'use client';

import { useState } from 'react';

import { ResignedListType } from '@/libs/validations/employee';

import { ResignedRequestCard } from './ResignedCards';

export const description = 'A pie chart with a custom label';

export function ResignationRequest({
  data,
  setRefetchEmployeeList,
}: {
  data: ResignedListType;
  setRefetchEmployeeList: (value: boolean) => void;
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
      <ResignedRequestCard
        setRefetchEmployeeList={setRefetchEmployeeList}
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
