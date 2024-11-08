'use client';

import { useState } from 'react';

import { ComplaintListType } from '@/libs/validations/complaint';

import { ComplaintCard } from './ComplaintCard';

export const description = 'A pie chart with a custom label';

export function PendingComplaints({ data }: { data: ComplaintListType }) {
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
      <ComplaintCard
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
