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
  value?: number;
  color: string;
}
interface PayrollCardProps {
  totalPaid?: number;
  totalUnpaid?: number;
  totalPaidAmount?: number;
  totalPerkAmount?: number;
  totalUnpaidAmount?: number;
  totalDeduction?: number;
}
const Cards: FunctionComponent<CardsProps> = ({
  icon,
  title,
  value,
  color,
}) => {
  const formatCurrency = (value: number | undefined) => {
    if (!value) return '₨ 0';

    const units = [
      { threshold: 1_00_00_000, suffix: ' Cr' },
      { threshold: 10_00_000, suffix: ' M' },
    ];

    for (const { threshold, suffix } of units) {
      if (value >= threshold) {
        return `₨ ${(value / threshold).toFixed(2).replace(/\.00$/, '')}${suffix}`;
      }
    }

    return `₨ ${value.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-0" style={{ color: color }}>
        {icon}
      </CardHeader>
      <CardContent className="flex items-center justify-between p-4 sm:gap-2">
        <div className="flex flex-col gap-4">
          <p className="text-xs">{title}</p>
          <p className="truncate text-xl font-bold md:text-2xl">
            {' '}
            {formatCurrency(value)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const PayrollStatistics: FunctionComponent<PayrollCardProps> = ({
  totalDeduction,
  totalPaid,
  totalUnpaid,
  totalPaidAmount,
  totalPerkAmount,
  totalUnpaidAmount,
}) => {
  const CardsData = [
    {
      id: 1,
      title: 'Total Paid',
      value: totalPaid || 0,
      color: '#28a745',
      icon: <CheckCircle size={24} />,
    },
    {
      id: 2,
      title: 'Total Unpaid',
      value: totalUnpaid || 0,
      color: '#dc3545',
      icon: <XCircle size={24} />,
    },

    {
      id: 3,
      title: 'Total Paid Amount',
      value: totalPaidAmount || 0,
      color: '#28a745',
      icon: <DollarSign size={24} />,
    },
    {
      id: 6,
      title: 'Total Perk Amount',
      value: totalPerkAmount || 0,
      color: '#17a2b8',
      icon: <Award size={24} />,
    },
    {
      id: 5,
      title: 'Amount To Be Paid',
      value: totalUnpaidAmount || 0,
      color: '#ffca28',
      icon: <CreditCard size={24} />,
    },
    {
      id: 6,
      title: 'Total Salary Deductions',
      value: totalDeduction || 0,
      color: '#dc3545',
      icon: <Minus color="#FF0000" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
      {CardsData.map((card, index) => (
        <Cards key={index} {...card} />
      ))}
    </div>
  );
};

export default PayrollStatistics;
