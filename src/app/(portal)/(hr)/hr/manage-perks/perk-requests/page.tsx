'use client';

import { FunctionComponent } from 'react';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { toast } from '@/components/ui/use-toast';

import { useHrPerkRequestsQuery } from '@/hooks/hrPerksList/useHrPerksList.hook';
import {
  approvePerkRequest,
  rejectPerkRequest,
} from '@/services/hr/perks-list.service';

import PerkRequestCard from './components/PerkRequestCard';

import { MessageErrorResponse } from '@/types';

interface PerkRequestsProps {}

const PerkRequestsPage: FunctionComponent<PerkRequestsProps> = () => {
  const { refetch, data } = useHrPerkRequestsQuery();

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

  const handleApprove = (id: string) => {
    approvePerk({ id: id });
  };

  const handleReject = (id: string) => {
    rejectPerk({ id: id });
  };
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Perk Requests">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8 px-2">
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          {data?.data.map(perkRequest => {
            return (
              <PerkRequestCard
                key={perkRequest._id}
                perkRequest={perkRequest}
                isApproving={isApproving}
                isRejecting={isRejecting}
                handleApprove={handleApprove}
                handleReject={handleReject}
              />
            );
          })}
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default PerkRequestsPage;
