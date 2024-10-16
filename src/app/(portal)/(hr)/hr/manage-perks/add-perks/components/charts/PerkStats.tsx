'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
interface PerkRecordProps {
  totalPerks: number | undefined;
  assignedPerks: number | undefined;
  approvedPerks: number | undefined;
  rejectedPerks: number | undefined;
}

export function PerkStats({
  totalPerks,
  assignedPerks,
  approvedPerks,
  rejectedPerks,
}: PerkRecordProps) {
  const perkData = [
    { id: 1, text: 'Total Perks', value: totalPerks },
    { id: 2, text: 'Assigned', value: assignedPerks },
    { id: 3, text: 'Approved', value: approvedPerks },
    { id: 4, text: 'Rejected', value: rejectedPerks },
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      {perkData.map(({ id, text, value }) => (
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
