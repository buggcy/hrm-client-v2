'use client';

import { FunctionComponent } from 'react';

import { CheckCircle2, Plus, UserCheck, XCircle } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface PerkRecordProps {
  totalPerks: number | undefined;
  assignedPerks: number | undefined;
  approvedPerks: number | undefined;
  rejectedPerks: number | undefined;
}
interface MiddleCardsProps {
  icon: JSX.Element;
  title: string;
  value: string;
  color: string;
}

const MiddleCards: FunctionComponent<MiddleCardsProps> = ({
  icon,
  title,
  value,
  color,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-0">{icon}</CardHeader>
      <CardContent className="flex items-center justify-between p-4 sm:gap-2">
        <div className="flex flex-col gap-4">
          <p className="text-xs">{title}</p>
          <p className="text-xl font-bold md:text-2xl" style={{ color: color }}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export function PerkStats({
  totalPerks,
  assignedPerks,
  approvedPerks,
  rejectedPerks,
}: PerkRecordProps) {
  const MiddleCardsData = [
    {
      icon: <Plus color="#6c757d" />,
      title: 'Total Perks',
      value: totalPerks?.toString() || '0',
      color: '',
    },
    {
      icon: <UserCheck color="#007bff" />,
      title: 'Total Assigned',
      value: assignedPerks?.toString() || '0',
      color: '',
    },
    {
      icon: <CheckCircle2 color="#28a745" />,
      title: 'Total Approved',
      value: approvedPerks?.toString() || '0',
      color: '',
    },
    {
      icon: <XCircle color="#FF0000" />,
      title: 'Total Rejected',
      value: rejectedPerks?.toString() || '0',
      color: '',
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      {MiddleCardsData.map((card, index) => (
        <MiddleCards key={index} {...card} />
      ))}
    </div>
  );
}
