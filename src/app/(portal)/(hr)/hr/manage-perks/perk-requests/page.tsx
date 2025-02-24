'use client';

import { FunctionComponent } from 'react';
import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import EmptyCard from '@/app/(authentication)/auth/register/components/emptyCard';
import { useHrPerkRequestsQuery } from '@/hooks/hrPerksList/useHrPerksList.hook';
import {
  approvePerkRequest,
  rejectPerkRequest,
} from '@/services/hr/perks-list.service';

import PerkRequestCard from './components/PerkRequestCard';

import { MessageErrorResponse } from '@/types';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface PerkRequestsProps {}

const PerkRequestsPage: FunctionComponent<PerkRequestsProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

  const { refetch, data } = useHrPerkRequestsQuery({
    from: selectedDate?.from ? formatDate(selectedDate.from) : '',
    to: selectedDate?.to ? formatDate(selectedDate.to) : '',
  });

  const router = useRouter();

  const { mutate: approvePerk, isPending: isApproving } = useMutation({
    mutationFn: approvePerkRequest,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on approving perk!',
        variant: 'error',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Perk request approved successfully!',
        variant: 'success',
      });
      void refetch();
    },
  });

  const { mutate: rejectPerk, isPending: isRejecting } = useMutation({
    mutationFn: rejectPerkRequest,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on rejecting perk!',
        variant: 'error',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Perk request rejected successfully!',
        variant: 'success',
      });
      void refetch();
    },
  });

  const handleApprove = (id: string, userId: string, perkId: string) => {
    approvePerk({ id: id, employeeId: userId, perkId: perkId });
  };

  const handleReject = (id: string, userId: string, perkId: string) => {
    rejectPerk({ id: id, employeeId: userId, perkId: perkId });
  };
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader
        title="Perk Requests"
        leftElement={
          <Button
            variant="outline"
            size="icon"
            aria-label="Go Back"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 p-1"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-5" />
          </Button>
        }
      >
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex max-w-full flex-col gap-8 px-2">
        <Header subheading="Review and Approve Employee Perks Requests">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
        </Header>
        {data?.data.length === 0 && (
          <EmptyCard message={'Employee Perks Requests'} />
        )}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.data.map(perkRequest => (
            <PerkRequestCard
              key={perkRequest._id}
              perkRequest={perkRequest}
              isApproving={isApproving}
              isRejecting={isRejecting}
              handleApprove={handleApprove}
              handleReject={handleReject}
            />
          ))}
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default PerkRequestsPage;
