'use client';

import React, { FunctionComponent, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { useStores } from '@/providers/Store.Provider';

import EmptyCard from '@/app/(authentication)/auth/register/components/emptyCard';
import { usePendingLeaveRequestQuery } from '@/hooks/hr/useLeaveList.hook';
import { LeaveListStoreType } from '@/stores/hr/leave-list';
import { formatedDate } from '@/utils';

import { LeaveRequest } from './ViewLeaveRequest';

interface HrLeaveRequestsProps {}

const LeaveApproval: FunctionComponent<HrLeaveRequestsProps> = () => {
  const searchParams = useSearchParams();

  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const { leaveListStore } = useStores() as {
    leaveListStore: LeaveListStoreType;
  };
  const { setRefetchLeaveList, refetchLeaveList } = leaveListStore;
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const {
    data: getPendingLeaveRequest,
    isLoading,
    isFetching,
    error,
    refetch,
  } = usePendingLeaveRequestQuery({
    page,
    limit,
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
  });

  useEffect(() => {}, [getPendingLeaveRequest, selectedDate]);
  useEffect(() => {
    if (refetchLeaveList) {
      void (async () => {
        await refetch();
      })();

      setRefetchLeaveList(false);
    }
  }, [refetchLeaveList, setRefetchLeaveList, refetch, page, limit]);

  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <Header subheading="Review and Approve Employee Leave Requests">
        <DateRangePicker
          timeRange={timeRange}
          selectedDate={selectedDate}
          setTimeRange={setTimeRange}
          setDate={handleSetDate}
        />
      </Header>

      <div className="mb-2 mt-4 grid h-full grid-cols-1 sm:gap-2 md:grid-cols-2 lg:grid-cols-2 lg:gap-6 xl:grid-cols-2 2xl:grid-cols-4">
        {isLoading || isFetching ? (
          <Skeleton className="h-6 w-full" />
        ) : getPendingLeaveRequest?.pagination?.totalCount &&
          getPendingLeaveRequest?.pagination?.totalCount > 0 ? (
          getPendingLeaveRequest?.data?.map(leave => (
            <LeaveRequest
              key={leave?._id}
              data={leave}
              selectedDate={selectedDate}
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center">
            <EmptyCard message="Manage Leave Requests" />
          </div>
        )}
      </div>
    </>
  );
};

export default LeaveApproval;
