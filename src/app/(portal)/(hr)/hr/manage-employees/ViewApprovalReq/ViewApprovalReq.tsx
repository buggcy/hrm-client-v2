'use client';

import { useState } from 'react';

import { ApprovalCard } from '../../approval/ApprovalCard/ApprovalCard';

export const description = 'A pie chart with a custom label';

const dummyPersona = {
  persona_id: '1',
  persona_name: 'Ahmad Mehmood',
  system_prompt: 'Example Prompt',
  created_at: '2023-09-26T00:00:00Z',
  updated_at: '2023-09-26T00:00:00Z',
  persona_type: null,
  default_replica_id: '123',
};

export function ApprovalRequest() {
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
        persona={dummyPersona}
        selected={selected}
        isSelectable={true}
        handleSelect={handleSelect}
        onClick={handleJoin}
        isLoading={isLoading}
      />
    </div>
  );
}
