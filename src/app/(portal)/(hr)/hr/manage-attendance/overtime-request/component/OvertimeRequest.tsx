'use client';

import { OvertimeListType } from '@/libs/validations/overtime';

import { OvertimeCard } from './OvertimeCard';

export const description = 'A pie chart with a custom label';

export function OvertimeRequest({ data }: { data: OvertimeListType }) {
  return (
    <div>
      <OvertimeCard request={data} />
    </div>
  );
}
