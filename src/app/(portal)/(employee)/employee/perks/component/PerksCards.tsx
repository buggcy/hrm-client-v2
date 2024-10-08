import { FunctionComponent } from 'react';

import { Tooltip } from '@radix-ui/react-tooltip';
import { ArrowDownRight, ArrowUpRight, Minus, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { PerkRecordApiResponse } from '@/libs/validations/perk';

import { PerkRecordChart } from './Chart/PerkRecordChart';

interface PerkCardProps {
  records?: PerkRecordApiResponse;
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
const PerkCards: FunctionComponent<PerkCardProps> = ({ records }) => {
  const MiddleCardsData = [
    {
      icon: <ArrowUpRight color="#4779e5" />,
      title: 'Average Increment',
      value: records?.averages
        ? String(records?.averages?.averageIncrementAmount) || '0'
        : '0',
      color: '',
    },
    {
      icon: <Plus color="#4779e5" />,
      title: 'Total Increment',
      value: records?.records
        ? String(records?.records?.totalIncrementAmount) || '0'
        : '0',
      color: '',
    },
    {
      icon: <ArrowDownRight color="#FF0000" />,
      title: 'Average Decrement',
      value: records?.averages
        ? String(records?.averages?.averageDecrementAmount) || '0'
        : '0',
      color: '',
    },

    {
      icon: <Minus color="#FF0000" />,
      title: 'Total Decrement',
      value: records?.records
        ? String(records?.records?.totalDecrementAmount) || '0'
        : '0',
      color: '',
    },
  ];

  return (
    <section className="flex w-full flex-col gap-4 lg:flex-row">
      <Card className="w-full lg:max-w-[33%]">
        <CardHeader className="pb-0">
          <div className="flex justify-between border-b-2 pb-4">
            <CardTitle className="text-sm font-semibold">
              Available Perks
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="my-2 flex max-h-[180px] flex-col gap-4 overflow-y-auto">
            {records?.availableData && records.availableData.length > 0 ? (
              records.availableData.map(perk => {
                const {
                  assignedIncrementAmount,
                  incrementAmount,
                  perksId,
                  decrementAmount,
                  assignedDecrementAmount,
                } = perk;
                const amountIncDifference =
                  assignedIncrementAmount - incrementAmount;
                const amountDecrDifference =
                  assignedDecrementAmount - decrementAmount;
                return (
                  <>
                    <div
                      key={perk._id}
                      className="flex flex-col rounded-lg border border-gray-200 p-2 shadow transition duration-200 hover:shadow-lg dark:dark:border-gray-300 dark:text-white"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-lg font-semibold">{perksId?.name}</p>
                        <div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge
                                  variant="outline"
                                  className={`text-sm ${amountIncDifference < 0 ? 'text-red-500' : 'text-green-500'}`}
                                >
                                  {`₨ : ${amountIncDifference}`}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                Remaining Increment
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge
                                  variant="outline"
                                  className={`ml-1 text-sm text-red-500`}
                                >
                                  {`₨ : ${amountDecrDifference}`}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                Remaining Decrement
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      <div className="flex justify-between text-gray-700">
                        <div>
                          <div className="flex flex-row justify-between">
                            <p className="text-sm dark:text-white">
                              Increment{' '}
                            </p>
                            <span className="ml-2 text-sm font-semibold dark:text-gray-300">{`₨ ${assignedIncrementAmount}`}</span>
                          </div>
                          <div className="flex flex-row justify-between">
                            <p className="text-sm dark:text-white">Used </p>
                            <span className="text-sm font-semibold dark:text-gray-300">{`₨ ${incrementAmount}`}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-row justify-between">
                            <p className="text-sm dark:text-white">
                              Decrement{' '}
                            </p>
                            <span className="ml-2 text-sm font-semibold dark:text-gray-300">{`₨ ${assignedDecrementAmount}`}</span>
                          </div>
                          <div className="flex flex-row justify-between">
                            <p className="text-sm dark:text-white">Deducted </p>
                            <span className="text-sm font-semibold dark:text-gray-300">{`₨ ${decrementAmount}`}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">Currently No Perks Available!</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <div className="grid w-full grid-cols-2 gap-4 lg:max-w-[34%]">
        {MiddleCardsData.map((card, index) => (
          <MiddleCards key={index} {...card} />
        ))}
      </div>
      <Card className="w-full lg:max-w-[33%]">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between border-b-2 pb-6">
            <CardTitle className="text-sm">Perks Statistics</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between pt-6 sm:gap-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
              <p className="font-semibold">
                {records?.records?.totalApprovedPerks}{' '}
                <span className="text-sm font-medium text-slate-400">
                  Approved
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-2))]"></div>
              <p className="font-semibold">
                {records?.records?.totalPendingPerks}{' '}
                <span className="text-sm font-medium text-slate-400">
                  Pending
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-3))]"></div>
              <p className="font-semibold">
                {records?.records?.totalRejectedPerks}{' '}
                <span className="text-sm font-medium text-slate-400">
                  Rejected
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[#30BBF2]"></div>
              <p className="font-semibold">
                {records?.records?.totalAvailablePerks}{' '}
                <span className="text-sm font-medium text-slate-400">
                  Available
                </span>
              </p>
            </div>
          </div>
          <PerkRecordChart data={records?.records} />
        </CardContent>
      </Card>
    </section>
  );
};

export default PerkCards;
