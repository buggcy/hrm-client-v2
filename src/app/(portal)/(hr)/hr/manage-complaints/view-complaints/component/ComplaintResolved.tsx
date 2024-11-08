'use client';

import React, { FunctionComponent, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { useStores } from '@/providers/Store.Provider';

import { usePendingComplaintQuery } from '@/hooks/complaint/useComplaint.hook';
import { ComplaintStoreType } from '@/stores/employee/complaint';
import { formatedDate } from '@/utils';

import { PendingComplaints } from './PendingComplaints';

interface Props {}

const ComplaintResolved: FunctionComponent<Props> = () => {
  const searchParams = useSearchParams();

  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const { complaintStore } = useStores() as {
    complaintStore: ComplaintStoreType;
  };
  const { setRefetchComplaintList, refetchComplaintList } = complaintStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const {
    data: getPendingComplaints,
    isLoading,
    isFetching,
    error,
    refetch,
  } = usePendingComplaintQuery({
    page,
    limit,
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
  });

  useEffect(() => {}, [getPendingComplaints, selectedDate]);
  useEffect(() => {
    if (refetchComplaintList) {
      void (async () => {
        await refetch();
      })();

      setRefetchComplaintList(false);
    }
  }, [refetchComplaintList, setRefetchComplaintList, refetch, page, limit]);

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
      <div className="mb-2 mt-4 grid h-full grid-cols-1 sm:gap-2 lg:grid-cols-4 lg:gap-6">
        {isLoading || isFetching ? (
          <Skeleton className="h-6 w-full" />
        ) : getPendingComplaints?.pagination?.totalCount &&
          getPendingComplaints?.pagination?.totalCount > 0 ? (
          getPendingComplaints?.data?.map(complaint => (
            <PendingComplaints key={complaint?._id} data={complaint} />
          ))
        ) : (
          <div className="flex size-full items-center justify-center">
            <span>No Pending Complaints Available!</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ComplaintResolved;
