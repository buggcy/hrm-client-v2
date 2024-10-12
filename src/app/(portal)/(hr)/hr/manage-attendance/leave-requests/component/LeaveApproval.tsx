'use client';

import React, { FunctionComponent, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import { Skeleton } from '@/components/ui/skeleton';
import { useStores } from '@/providers/Store.Provider';

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
      <div className="mb-4 flex justify-end">
        <DateRangePicker
          timeRange={timeRange}
          selectedDate={selectedDate}
          setTimeRange={setTimeRange}
          setDate={handleSetDate}
        />
      </div>
      <div className="mb-2 grid h-full grid-cols-1 sm:gap-2 lg:grid-cols-4 lg:gap-6">
        {isLoading || isFetching ? (
          <Skeleton className="h-6 w-full" />
        ) : getPendingLeaveRequest?.pagination?.totalCount &&
          getPendingLeaveRequest?.pagination?.totalCount > 0 ? (
          getPendingLeaveRequest?.data?.map(leave => (
            <LeaveRequest key={leave?._id} data={leave} />
          ))
        ) : (
          <div className="flex size-full items-center justify-center">
            <span>No Pending Leave Request Available!</span>
          </div>
        )}
      </div>
    </>
  );
};

export default LeaveApproval;
