'use client';

import React, { FunctionComponent, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { useStores } from '@/providers/Store.Provider';

import EmptyCard from '@/app/(authentication)/auth/register/components/emptyCard';
import { usePendingLeaveRequestQuery } from '@/hooks/hr/useLeaveList.hook';
import { AttendanceListStoreType } from '@/stores/hr/attendance-list';
import { formatedDate } from '@/utils';

import { LeaveRequest } from './ViewLeaveRequest';

interface HrAttendanceRequestsProps {}

const AttendanceApproval: FunctionComponent<HrAttendanceRequestsProps> = () => {
  const searchParams = useSearchParams();

  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const { attendanceListStore } = useStores() as {
    attendanceListStore: AttendanceListStoreType;
  };
  const { setRefetchAttendanceList, refetchAttendanceList } =
    attendanceListStore;
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const {
    data: pendingAttendanceRequests,
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

  useEffect(() => {
    if (refetchAttendanceList) {
      void (async () => {
        await refetch();
      })();

      setRefetchAttendanceList(false);
    }
  }, [refetchAttendanceList, setRefetchAttendanceList, refetch, page, limit]);

  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <Header subheading="Review and Approve Employee Attendance Requests">
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
        ) : pendingAttendanceRequests?.pagination?.totalCount &&
          pendingAttendanceRequests?.pagination?.totalCount > 0 ? (
          pendingAttendanceRequests?.data?.map(leave => (
            <LeaveRequest
              key={leave?._id}
              data={leave}
              selectedDate={selectedDate}
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center">
            <EmptyCard message="Manage Attendance Requests" />
          </div>
        )}
      </div>
    </>
  );
};

export default AttendanceApproval;
