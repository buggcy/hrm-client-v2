'use client';

import { FunctionComponent, Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { hrLeaveListColumns } from '@/components/data-table/columns/hr-leave-list.columns';
import { LeaveListDataTable } from '@/components/data-table/data-table-hr-leave-list';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
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
import { useStores } from '@/providers/Store.Provider';

import {
  useLeaveListPostQuery,
  useLeaveListRecordQuery,
} from '@/hooks/hr/useLeaveList.hook';
import { LeaveListArrayType } from '@/libs/validations/hr-leave-list';
import { searchLeaveList } from '@/services/hr/leave-list.service';
import { LeaveListStoreType } from '@/stores/hr/leave-list';
import { formatedDate } from '@/utils';

import { LeavesDistributionChart } from './components/charts/leaves-distribution';
import { LeavesTrendChart } from './components/charts/leaves-trend';

import { MessageErrorResponse } from '@/types';

interface HrAttendanceListProps {}

const HrLeaveList: FunctionComponent<HrAttendanceListProps> = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { leaveListStore } = useStores() as {
    leaveListStore: LeaveListStoreType;
  };
  const { setRefetchLeaveList, refetchLeaveList } = leaveListStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);
  const [status, setStatus] = useState<string[]>([]);

  const {
    data: leavePostList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useLeaveListPostQuery({
    page,
    limit,
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
    status,
    userId: '',
  });

  const { data: leaveListRecords, refetch: refetchRecord } =
    useLeaveListRecordQuery({
      from: formatedDate(selectedDate?.from),
      to: formatedDate(selectedDate?.to),
    });

  const {
    mutate,
    isPending,
    data: searchLeaveListData,
  } = useMutation({
    mutationFn: searchLeaveList,
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<MessageErrorResponse>;
      toast({
        title: 'Error',
        description:
          axiosError?.response?.data?.message ||
          'Error on fetching search data!',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      mutate({ query: debouncedSearchTerm, page, limit });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, refetch, mutate, page, limit, status]);

  useEffect(() => {}, [leavePostList, selectedDate]);
  useEffect(() => {}, [leaveListRecords, selectedDate]);
  useEffect(() => {
    if (refetchLeaveList) {
      void (async () => {
        await refetch();
        await refetchRecord();
      })();

      setRefetchLeaveList(false);
    }
  }, [refetchLeaveList, setRefetchLeaveList, refetch, refetchRecord, status]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handlePaginationChange = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    params.set('limit', newLimit.toString());
    router.push(`?${params.toString()}`);
  };

  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  const tableData: LeaveListArrayType = debouncedSearchTerm
    ? searchLeaveListData?.data || []
    : leavePostList?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchLeaveListData?.pagination?.totalPages || 0
    : leavePostList?.pagination?.totalPages || 0;

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Attendance">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-12 px-2">
        <Header subheading="You are 15 minutes late today!">
          <DateRangePicker
            timeRange={timeRange}
            selectedDate={selectedDate}
            setTimeRange={setTimeRange}
            setDate={handleSetDate}
          />
          <Button variant="outline" asChild>
            <Link
              href="/hr/manage-attendance/leave-requests"
              className="flex items-center"
            >
              View Leave Requests
              <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                {leaveListRecords?.pendingCount || 0}
              </span>
            </Link>
          </Button>
        </Header>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <LeavesTrendChart />
          <LeavesDistributionChart data={leaveListRecords} />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          {isLoading || isFetching ? (
            <DataTableLoading columnCount={7} rowCount={limit} />
          ) : (
            <LeaveListDataTable
              searchLoading={isPending}
              data={tableData || []}
              columns={hrLeaveListColumns}
              pagination={{
                pageCount: tablePageCount || 1,
                page: page,
                limit: limit,
                onPaginationChange: handlePaginationChange,
              }}
              onSearch={handleSearchChange}
              searchTerm={searchTerm}
              toolbarType={'leavePostList'}
              setFilterValue={setStatus}
              filterValue={status}
            />
          )}
        </Suspense>
      </LayoutWrapper>
    </Layout>
  );
};

export default HrLeaveList;
