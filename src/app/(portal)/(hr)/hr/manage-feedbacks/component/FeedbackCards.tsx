'use client';

import { FunctionComponent } from 'react';

import {
  AlignJustify,
  Smile,
  Star,
  ThumbsDown,
  ThumbsUp,
  User,
} from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CardsProps {
  icon: JSX.Element;
  title: string;
  value?: number;
  color: string;
}
interface FeedbackCardProps {
  totalUsers?: number;
  averagePercentage?: number;
  goodPercentage?: number;
  excellentPercentage?: number;
  belowAveragePercentage?: number;
  veryGoodPercentage?: number;
}
const Cards: FunctionComponent<CardsProps> = ({
  icon,
  title,
  value,
  color,
}) => {
  return (
    <Card className="mt-4 w-full">
      <CardHeader className="p-4 pb-0" style={{ color: color }}>
        {icon}
      </CardHeader>
      <CardContent className="flex items-center justify-between p-4 sm:gap-2">
        <div className="flex flex-col gap-4">
          <p className="text-xs">{title}</p>
          <p className="truncate text-xl font-bold md:text-2xl">
            {title === 'Total Users' ? value : `${Math.round(value || 0)}%`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const FeedbackStatistics: FunctionComponent<FeedbackCardProps> = ({
  totalUsers,
  averagePercentage,
  goodPercentage,
  excellentPercentage,
  belowAveragePercentage,
  veryGoodPercentage,
}) => {
  const CardsData = [
    {
      id: 1,
      title: 'Total Users',
      value: totalUsers || 0,
      color: '#17a2b8',
      icon: <User size={24} />,
    },
    {
      id: 2,
      title: 'Excellent',
      value: excellentPercentage || 0,
      color: '#f39c12',
      icon: <Star size={24} />,
    },
    {
      id: 3,
      title: 'Very Good',
      value: veryGoodPercentage || 0,
      color: '#40E0D0',
      icon: <Smile size={24} />,
    },
    {
      id: 4,
      title: 'Good',
      value: goodPercentage || 0,
      color: '#28a745',
      icon: <ThumbsUp size={24} />,
    },
    {
      id: 5,
      title: 'Average',
      value: averagePercentage || 0,
      color: '#7f8c8d',
      icon: <AlignJustify size={24} />,
    },
    {
      id: 5,
      title: 'Below Average',
      value: belowAveragePercentage || 0,
      color: '#dc3545',
      icon: <ThumbsDown size={24} />,
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

export default FeedbackStatistics;
