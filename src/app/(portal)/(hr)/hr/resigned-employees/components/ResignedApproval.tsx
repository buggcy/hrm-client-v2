'use client';

import React, { FunctionComponent, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { DateRange } from 'react-day-picker';

import { Skeleton } from '@/components/ui/skeleton';
import { useStores } from '@/providers/Store.Provider';

import EmptyCard from '@/app/(authentication)/auth/register/components/emptyCard';
import {
  usePendingResignedRequestQuery,
  useResignedEmployeeQuery,
} from '@/hooks/hr/useEmployeeResigned.hook';
import { EmployeeStoreType } from '@/stores/hr/employee';
import { formatedDate } from '@/utils';

import { ResignationRequest } from './ViewResgination';
interface ResignedRequestProps {
  selectedDate?: DateRange;
}

const ResignedApproval: FunctionComponent<ResignedRequestProps> = ({
  selectedDate,
}) => {
  const searchParams = useSearchParams();
  const { employeeStore } = useStores() as { employeeStore: EmployeeStoreType };
  const { setRefetchEmployeeList, refetchEmployeeList } = employeeStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const {
    data: pendingResigned,
    isLoading,
    isFetching,
    error,
    refetch,
  } = usePendingResignedRequestQuery({
    page,
    limit,
    from: selectedDate?.from ? formatedDate(selectedDate.from) : undefined,
    to: selectedDate?.to ? formatedDate(selectedDate.to) : undefined,
  });

  const { refetch: ResignationRefetch } = useResignedEmployeeQuery({
    page,
    limit,
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
  });
  useEffect(() => {}, [pendingResigned, selectedDate]);

  useEffect(() => {
    if (refetchEmployeeList) {
      void (async () => {
        await refetch();
        await ResignationRefetch();
      })();

      setRefetchEmployeeList(false);
    }
  }, [
    refetchEmployeeList,
    setRefetchEmployeeList,
    refetch,
    page,
    limit,
    ResignationRefetch,
  ]);

  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <div className="mb-2 mt-4 grid h-full grid-cols-1 sm:gap-2 lg:grid-cols-3 lg:gap-6">
        {isLoading || isFetching ? (
          <Skeleton className="h-6 w-full" />
        ) : pendingResigned?.pagination?.totalCount &&
          pendingResigned?.pagination?.totalCount > 0 ? (
          pendingResigned?.data?.map(employee => (
            <ResignationRequest
              key={employee?._id}
              data={employee}
              setRefetchEmployeeList={setRefetchEmployeeList}
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center">
            <EmptyCard message="Resignation Requests available" />
          </div>
        )}
      </div>
    </>
  );
};

export default ResignedApproval;
