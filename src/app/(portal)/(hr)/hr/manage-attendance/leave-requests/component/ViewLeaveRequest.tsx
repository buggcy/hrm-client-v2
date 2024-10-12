'use client';

import { useState } from 'react';

import { LeaveListType } from '@/libs/validations/hr-leave-list';

import { LeaveRequestCard } from './LeaveRequestCard';

export const description = 'A pie chart with a custom label';

export function LeaveRequest({ data }: { data: LeaveListType }) {
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
      <LeaveRequestCard
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
