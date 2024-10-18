'use client';

import { FunctionComponent } from 'react';

import {
  Award,
  CheckCircle,
  CreditCard,
  DollarSign,
  Minus,
  XCircle,
} from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CardsProps {
  icon: JSX.Element;
  title: string;
  value: number;
  color: string;
}
const Cards: FunctionComponent<CardsProps> = ({
  icon,
  title,
  value,
  color,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-0" style={{ color: color }}>
        {icon}
      </CardHeader>
      <CardContent className="flex items-center justify-between p-4 sm:gap-2">
        <div className="flex flex-col gap-4">
          <p className="text-xs">{title}</p>
          <p className="text-xl font-bold md:text-2xl">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const CardsData = [
  {
    id: 1,
    title: 'Total Paid',
    value: 1,
    color: '#28a745',
    icon: <CheckCircle size={24} />,
  },
  {
    id: 2,
    title: 'Total Unpaid',
    value: 3,
    color: '#dc3545',
    icon: <XCircle size={24} />,
  },

  {
    id: 3,
    title: 'Total Paid Amount',
    value: 400,
    color: '#28a745',
    icon: <DollarSign size={24} />,
  },
  {
    id: 6,
    title: 'Total Perk Amount',
    value: 600,
    color: '#17a2b8',
    icon: <Award size={24} />,
  },
  {
    id: 5,
    title: 'Amount To Be Paid',
    value: 300,
    color: '#ffca28',
    icon: <CreditCard size={24} />,
  },
  {
    id: 6,
    title: 'Total Salary Deductions',
    value: 500,
    color: '#dc3545',
    icon: <Minus color="#FF0000" />,
  },
];

export function PayrollStatistics() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
      {CardsData.map((card, index) => (
        <Cards key={index} {...card} />
      ))}
    </div>
  );
}
