'use client';
import React from 'react';

import { ClipboardList, ThumbsDown } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { CardData } from '@/services/hr/employee.service';

import { AddAreaChart } from './AddAreaChart';
import { RedicalChart } from './RedicalChart';
interface Props {
  data?: CardData;
}
function AddEmpCards({ data }: Props) {
  return (
    <div className="flex w-full justify-between gap-4 max-lg:flex-col max-lg:items-center">
      <AddAreaChart />
      <div className="flex w-full flex-row gap-5 lg:w-1/5 lg:flex-col">
        <Card className="flex h-full flex-col justify-center bg-white p-1 shadow-sm dark:bg-[#18181b] max-lg:w-full">
          <CardHeader className="flex gap-2 p-3">
            <ThumbsDown className="size-5 text-green-900" />
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex justify-between">
              <div className="flex items-center justify-between gap-5">
                <h2 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">
                  Expired Invitations:
                </h2>
                <p className="text-xl font-bold text-green-900 dark:text-green-900">
                  {(data?.Card3Data.tba.expired || 0) +
                    (data?.Card3Data.Rejected.expired || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col justify-center bg-white p-1 shadow-sm dark:bg-[#18181b] max-lg:w-full">
          <CardHeader className="flex gap-2 p-3">
            <ClipboardList className="size-5 text-green-900" />
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex justify-between">
              <div className="flex items-center justify-between gap-5">
                <h2 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">
                  Pending Invitations:
                </h2>
                <p className="text-xl font-bold text-green-900 dark:text-green-900">
                  {(data?.Card3Data.tba.pending || 0) +
                    (data?.Card3Data.Rejected.pending || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <RedicalChart data={data?.Card2Data} />
    </div>
  );
}

export default AddEmpCards;
