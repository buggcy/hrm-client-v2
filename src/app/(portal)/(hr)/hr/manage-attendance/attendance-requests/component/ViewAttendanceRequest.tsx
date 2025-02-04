'use client';

import { AttendanceRequestCard } from './AttendanceRequestCard';

export const description = 'A pie chart with a custom label';

import { AttendanceRequestType } from '@/libs/validations/attendance-list';

export function AttendanceRequest({ data }: { data: AttendanceRequestType }) {
  return (
    <div>
      <AttendanceRequestCard request={data} />
    </div>
  );
}
