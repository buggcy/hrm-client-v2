import { FunctionComponent } from 'react';

import {
  CheckCircle2,
  Circle,
  CircleArrowOutUpRight,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const PerkCards: FunctionComponent = () => {
  return (
    <section className="flex w-full flex-col gap-4 lg:flex-row">
      <Card className="w-full lg:max-w-[33%]">
        <CardHeader className="pb-0">
          <div className="flex justify-between border-b-2 pb-6">
            <CardTitle className="text-sm">Available Perks</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex max-h-[250px] flex-col gap-2 space-y-4 overflow-y-auto p-2 pt-4">
            <div className="flex w-full flex-row justify-between gap-4">
              <p className="border-l-2 border-l-blue-700 pl-2">Car Allowance</p>
              <Badge variant="outline">{'PKR: 1000'}</Badge>
            </div>
            <div className="flex w-full flex-row justify-between gap-4">
              <p className="border-l-2 border-l-blue-700 pl-2">
                Bike Allowance
              </p>
              <Badge variant="outline">{'PKR: 1500'}</Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <div className="grid w-full grid-cols-2 gap-4 lg:max-w-[34%]">
        <Card className="w-full">
          <CardHeader className="p-4 pb-0">
            <Circle color="#FFCC00" />
          </CardHeader>
          <CardContent className="flex items-center justify-between p-4 sm:gap-2">
            <div className="flex flex-col gap-4">
              <p className="text-xs">Average Pending</p>
              <p
                className="text-xl font-bold md:text-2xl"
                style={{ color: '#FFCC00' }}
              >
                {'0.5'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="p-4 pb-0">
            <CheckCircle2 color="#2ba476" />
          </CardHeader>
          <CardContent className="flex items-center justify-between p-4 sm:gap-2">
            <div className="flex flex-col gap-4">
              <p className="text-xs">{'Average Approved'}</p>
              <p
                className="text-xl font-bold md:text-2xl"
                style={{ color: '#2ba476' }}
              >
                {'0'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="p-4 pb-0">
            <XCircle color="#e5684f" />
          </CardHeader>
          <CardContent className="flex items-center justify-between p-4 sm:gap-2">
            <div className="flex flex-col gap-4">
              <p className="text-xs">{'Average Rejected'}</p>
              <p
                className="text-xl font-bold md:text-2xl"
                style={{ color: '#e5684f' }}
              >
                {'1.5'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="p-4 pb-0">
            <CircleArrowOutUpRight color="#B0B0B0" />
          </CardHeader>
          <CardContent className="flex items-center justify-between p-4 sm:gap-2">
            <div className="flex flex-col gap-4">
              <p className="text-xs">{'Available'}</p>
              <p
                className="text-xl font-bold md:text-2xl"
                style={{ color: '#B0B0B0' }}
              >
                {'2.5'}
              </p>
            </div>
          </CardContent>
        </Card>
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
                <span className="text-sm font-medium text-slate-400">
                  Approved
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-2))]"></div>
              <p className="font-semibold">
                <span className="text-sm font-medium text-slate-400">
                  Pending
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-3))]"></div>
              <p className="font-semibold">
                <span className="text-sm font-medium text-slate-400">
                  Rejected
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-4))]"></div>
              <p className="font-semibold">
                <span className="text-sm font-medium text-slate-400">
                  Availed
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PerkCards;
