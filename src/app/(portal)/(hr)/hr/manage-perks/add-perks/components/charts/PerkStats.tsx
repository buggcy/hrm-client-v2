'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const mockData: { id: number; text: string; value: number }[] = [
  {
    id: 1,
    text: 'Total Perks',
    value: 100,
  },
  {
    id: 2,
    text: 'Assigned',
    value: 200,
  },
  {
    id: 3,
    text: 'Approved',
    value: 300,
  },
  {
    id: 4,
    text: 'Rejected',
    value: 400,
  },
];

export function PerkStats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {mockData.map(({ id, text, value }) => (
        <Card
          key={id}
          className="flex flex-col items-center justify-center text-center"
        >
          <CardHeader className="pb-0 lg:pt-0">
            <CardTitle>{text}</CardTitle>
            <CardDescription className="text-base">{value}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
