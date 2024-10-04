import { FunctionComponent } from 'react';

import { Clock4, Clock7, Fingerprint, LogIn, LogOut } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { AttendanceChart } from './Charts/attendance-count';
import { HoursCompletedChart } from './Charts/hours-completed';
import CountdownTimer from './CountdownTimer';

import { AttendanceApiResponse } from '@/types/attendance-history.types';
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

interface AttendanceCardsProps {
  isPending?: boolean;
  data?: AttendanceApiResponse;
}

const convertDecimalToHoursAndMinutes = (decimalHours: number): string => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();

  return `${hours}:${formattedMinutes}`;
};

const AttendanceCards: FunctionComponent<AttendanceCardsProps> = ({ data }) => {
  const { card1Data, card2Data, card3Data } = data || {};

  const averageHours = card2Data?.averageHours;
  const averageHoursFormatted = convertDecimalToHoursAndMinutes(
    averageHours || 0,
  );

  const MiddleCardsData = [
    {
      icon: <Clock7 color="#4779e5" />,
      title: 'Average Hours',
      value: averageHoursFormatted || 'N/A',
      color: '',
    },
    {
      icon: <LogIn color="#4779e5" />,
      title: 'Average Check-in',
      value: card2Data?.averageCheckInTime || '10:00 AM',
      color: '',
    },
    {
      icon: <Clock4 color="#2ba476" />,
      title: 'On Time Arrivals',
      value: card2Data?.onTimeArrivals?.toString() || '0',
      color: '#2ba476',
    },
    {
      icon: <LogOut color="#e5684f" />,
      title: 'Average Check-out',
      value: card2Data?.averageCheckOutTime || '07:00 PM',
      color: '#e5684f',
    },
  ];

  return (
    <section className="flex w-full flex-col gap-4 lg:flex-row">
      <Card className="w-full lg:max-w-[33%]">
        <CardHeader className="pb-0">
          <div className="flex justify-between border-b-2 pb-6">
            <CardTitle className="text-sm">Today</CardTitle>
            <Badge variant="destructive">{card1Data?.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-between pt-6 sm:flex-row sm:gap-2">
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-start">
              <Fingerprint size={32} color="#4779e5" />
              <p className="text-sm">
                {card1Data?.status === 'Present'
                  ? 'You have marked yourself as present today'
                  : 'You have not marked youself as present today'}
              </p>
            </div>
            <p className="border-l-2 border-l-destructive pl-2">
              Time Left: <CountdownTimer timeInMinutes={card1Data?.timeLeft} />
            </p>
          </div>
          <HoursCompletedChart timeCompleted={card1Data?.timeCompleted} />
        </CardContent>
        <CardFooter>
          <TooltipProvider disableHoverableContent delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <Button className="w-full" disabled>
                    {card1Data?.status === 'Absent'
                      ? 'Mark Present'
                      : 'Marked Present'}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Coming Soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
      <div className="grid w-full grid-cols-2 gap-4 lg:max-w-[34%]">
        {MiddleCardsData.map((card, index) => (
          <MiddleCards key={index} {...card} />
        ))}
      </div>
      <Card className="w-full lg:max-w-[33%]">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between border-b-2 pb-6">
            <CardTitle className="text-sm">My Attendance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between pt-6 sm:gap-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
              <p className="font-semibold">
                {card3Data?.onTimeCheckIns}{' '}
                <span className="text-sm font-medium text-slate-400">
                  on-time
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-2))]"></div>
              <p className="font-semibold">
                {card3Data?.lateCheckIns}{' '}
                <span className="text-sm font-medium text-slate-400">late</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-3))]"></div>
              <p className="font-semibold">
                {card3Data?.leaves}{' '}
                <span className="text-sm font-medium text-slate-400">
                  leaves
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-4))]"></div>
              <p className="font-semibold">
                {card3Data?.absents}{' '}
                <span className="text-sm font-medium text-slate-400">
                  absent
                </span>
              </p>
            </div>
          </div>
          <AttendanceChart data={card3Data} />
        </CardContent>
      </Card>
    </section>
  );
};

export default AttendanceCards;
