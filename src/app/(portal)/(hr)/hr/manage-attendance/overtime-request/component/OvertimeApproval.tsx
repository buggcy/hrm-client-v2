'use client';

import React, { FunctionComponent, useEffect } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useStores } from '@/providers/Store.Provider';

import EmptyCard from '@/app/(authentication)/auth/register/components/emptyCard';
import { useOvertimeRequestsQuery } from '@/hooks/overtime/useOvertime.hook';
import { OvertimeStoreType } from '@/stores/employee/overtime';
import { formatedDate } from '@/utils';

import { OvertimeRequest } from './OvertimeRequest';

interface HrAttendanceRequestsProps {
  selectedDate?: {
    from?: Date;
    to?: Date;
  };
}

const OvertimeApproval: FunctionComponent<HrAttendanceRequestsProps> = ({
  selectedDate,
}) => {
  const { overtimeStore } = useStores() as {
    overtimeStore: OvertimeStoreType;
  };
  const { setRefetchOvertimeList, refetchOvertimeList } = overtimeStore;
  const {
    data: pendingList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useOvertimeRequestsQuery({
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
  });

  useEffect(() => {
    if (refetchOvertimeList) {
      void (async () => {
        await refetch();
      })();

      setRefetchOvertimeList(false);
    }
  }, [refetchOvertimeList, setRefetchOvertimeList, refetch]);

  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <div className="mt-4 grid w-full grid-cols-1 gap-4 overflow-visible sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading || isFetching ? (
          <Skeleton className="h-6 w-full" />
        ) : pendingList?.totalCount ? (
          pendingList?.data?.map(request => (
            <OvertimeRequest key={request?._id} data={request} />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center">
            <EmptyCard message="Manage Overtime Requests" />
          </div>
        )}
      </div>
    </>
  );
};

export default OvertimeApproval;
