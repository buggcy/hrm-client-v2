'use client';

import React, { FunctionComponent, useEffect } from 'react';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { useStores } from '@/providers/Store.Provider';

import EmptyCard from '@/app/(authentication)/auth/register/components/emptyCard';
import { useAttendanceRequestsQuery } from '@/hooks/attendanceList/useAttendanceList.hook';
import { AttendanceListStoreType } from '@/stores/hr/attendance-list';
import { formatedDate } from '@/utils';

import { AttendanceRequest } from './ViewAttendanceRequest';

interface HrAttendanceRequestsProps {}

const AttendanceApproval: FunctionComponent<HrAttendanceRequestsProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const { attendanceListStore } = useStores() as {
    attendanceListStore: AttendanceListStoreType;
  };
  const { setRefetchAttendanceList, refetchAttendanceList } =
    attendanceListStore;
  const {
    data: pendingAttendanceRequests,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAttendanceRequestsQuery({
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
  }, [refetchAttendanceList, setRefetchAttendanceList, refetch]);

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
        ) : pendingAttendanceRequests?.requests.length ? (
          pendingAttendanceRequests?.requests?.map(request => (
            <AttendanceRequest key={request?._id} data={request} />
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
