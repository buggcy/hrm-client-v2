import React, { FunctionComponent, useState } from 'react';

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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
        ? Number(records?.averages?.averageIncrementAmount)?.toFixed(1) || '0'
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
        ? Number(records?.averages?.averageDecrementAmount)?.toFixed(1) || '0'
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
  const [activeTab, setActiveTab] = useState<string>('Available');
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  return (
    <section className="flex w-full flex-col gap-4 lg:flex-row">
      <Card className="w-full lg:max-w-[33%]">
        <CardHeader className="pb-0">
          <div className="flex justify-between border-b-2 pb-4">
            <CardTitle className="mt-2.5 text-sm font-semibold">
              {`${activeTab} Perks`}
            </CardTitle>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="flex">
                <TabsTrigger value="Available">Available</TabsTrigger>
                <TabsTrigger value="Approved">Approved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'Available' && (
            <ScrollArea className="mt-2 h-48 w-full">
              <div className="flex flex-col gap-4">
                {records?.availableData && records.availableData.length > 0 ? (
                  records.availableData.map(perk => {
                    const {
                      assignedIncrementAmount,
                      incrementAmount,
                      perksId,
                    } = perk;
                    const amountIncDifference =
                      assignedIncrementAmount - incrementAmount;

                    return (
                      <>
                        <div
                          key={perk._id}
                          className="flex flex-col rounded-lg border border-gray-200 p-2 dark:dark:border-gray-300 dark:text-white"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-base font-semibold">
                              {perksId?.name}
                            </p>
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
                            </div>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <div className="flex flex-row justify-between">
                              <p className="text-sm dark:text-gray-300">
                                Increment{' '}
                                <span className="ml-2 text-sm font-semibold dark:text-white">{`₨ ${assignedIncrementAmount}`}</span>
                              </p>
                            </div>
                            <div className="flex flex-row justify-between">
                              <p className="text-sm dark:text-gray-300">
                                Used{' '}
                                <span className="ml-2 text-sm font-semibold dark:text-white">{`₨ ${incrementAmount}`}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">
                      Currently No Perks Available!
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {activeTab === 'Approved' && (
            <ScrollArea className="mt-2 h-48 w-full">
              <div className="flex flex-col gap-4">
                {records?.approvedData && records.approvedData.length > 0 ? (
                  records.approvedData.map(perk => {
                    const {
                      assignedIncrementAmount,
                      incrementAmount,
                      perksId,
                      assignedDecrementAmount,
                      decrementAmount,
                    } = perk;
                    const amountIncDifference =
                      assignedIncrementAmount - incrementAmount;
                    const amountDecDifference =
                      assignedDecrementAmount - decrementAmount;

                    return (
                      <>
                        <div
                          key={perk._id}
                          className="flex flex-col rounded-lg border border-gray-200 p-2 dark:dark:border-gray-300 dark:text-white"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-base font-semibold">
                              {perksId?.name}
                            </p>
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge
                                      variant="outline"
                                      className={`text-sm text-red-500`}
                                    >
                                      {`₨ : ${amountDecDifference}`}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Remaining Decrement
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              {perk?.perksId?.salaryIncrement &&
                                perk?.perksId?.salaryDecrement && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge
                                          variant="outline"
                                          className={`text-sm text-green-500`}
                                        >
                                          {`₨ : ${amountIncDifference}`}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Remaining Increment
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                            </div>
                          </div>

                          <div className="flex justify-between text-gray-700">
                            <div className="flex flex-row justify-between">
                              <p className="text-sm dark:text-gray-300">
                                Decrement{' '}
                              </p>
                              <span className="ml-2 text-sm font-semibold dark:text-white">{`₨ ${assignedDecrementAmount}`}</span>
                            </div>
                            <div className="flex flex-row justify-between">
                              <p className="text-sm dark:text-gray-300">
                                {' '}
                                Deducted{' '}
                              </p>
                              <span className="ml-2 text-sm font-semibold dark:text-white">{`₨ ${decrementAmount}`}</span>
                            </div>
                          </div>
                          {perk?.perksId?.salaryIncrement &&
                            perk?.perksId?.salaryDecrement && (
                              <div className="flex justify-between text-gray-700">
                                <div className="flex flex-row justify-between">
                                  <p className="mr-1 text-sm dark:text-gray-300">
                                    Increment{' '}
                                  </p>
                                  <span className="ml-3 text-sm font-semibold dark:text-white">{`₨ ${assignedIncrementAmount}`}</span>
                                </div>
                                <div className="flex flex-row justify-between">
                                  <p className="text-sm dark:text-gray-300">
                                    Used{' '}
                                  </p>
                                  <span className="ml-2 text-sm font-semibold dark:text-white">{`₨ ${incrementAmount}`}</span>
                                </div>
                              </div>
                            )}
                        </div>
                      </>
                    );
                  })
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">
                      Currently No Perks Approved!
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
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
