'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';

import { hrComplaintColumns } from '@/components/data-table/columns/hr-complaint.columns';
import { ComplaintDataTable } from '@/components/data-table/data-table-complaint';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import {
  useComplaintQuery,
  useComplaintRecordQuery,
} from '@/hooks/complaint/useComplaint.hook';
import { ComplaintListArrayType } from '@/libs/validations/complaint';
import { searchComplaints } from '@/services/employee/complaint.service';
import { AuthStoreType } from '@/stores/auth';
import { ComplaintStoreType } from '@/stores/employee/complaint';
import { formatedDate } from '@/utils';

import { ComplaintDistributionChart } from './ComplaintRecordChart';
import { ComplaintTrendChart } from './ComplaintTrendChart';

import { MessageErrorResponse } from '@/types';

interface Props {}

const HrComplaintTable: FunctionComponent<Props> = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const { complaintStore } = useStores() as {
    complaintStore: ComplaintStoreType;
  };
  const { setRefetchComplaintList, refetchComplaintList } = complaintStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);
  const [status, setStatus] = useState<string[]>([]);
  const { data: complaintRecords, refetch: refetchRecord } =
    useComplaintRecordQuery({
      from: formatedDate(selectedDate?.from),
      to: formatedDate(selectedDate?.to),
    });
  const {
    data: getComplaints,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useComplaintQuery({
    page,
    limit,
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
    status,
  });

  const {
    mutate,
    isPending,
    data: searchData,
  } = useMutation({
    mutationFn: searchComplaints,
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<MessageErrorResponse>;
      toast({
        title: 'Error',
        description:
          axiosError?.response?.data?.message ||
          'An unexpected error occurred. Please try again later or contact support if the issue persists.',
        variant: 'error',
      });
    },
  });

  useEffect(() => {
    if (error) {
      if (error instanceof ZodError) {
        error.issues.forEach(issue => {
          const path = issue.path;
          const message = issue.message;

          toast({
            title: `Validation Error at ${path.join(', ')}`,
            description: message,
            variant: 'error',
          });
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'An error occurred',
          variant: 'error',
        });
      }
    }
  }, [error]);

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
      mutate({
        query: debouncedSearchTerm,
        page,
        limit,
        userId: '',
        from: formatedDate(selectedDate?.from),
        to: formatedDate(selectedDate?.to),
      });
    } else {
      void (async () => {
        await refetch();
        await refetchRecord();
      })();
    }
  }, [
    debouncedSearchTerm,
    refetch,
    mutate,
    page,
    limit,
    status,
    refetchRecord,
    selectedDate?.from,
    selectedDate?.to,
  ]);

  useEffect(() => {}, [getComplaints, selectedDate]);
  useEffect(() => {}, [complaintRecords, selectedDate]);
  useEffect(() => {
    if (refetchComplaintList) {
      void (async () => {
        await refetch();
        await refetchRecord();
      })();

      setRefetchComplaintList(false);
    }
  }, [
    refetchComplaintList,
    setRefetchComplaintList,
    refetch,
    status,
    refetchRecord,
  ]);

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
        Failed to load Complaints. Please check the data.
      </div>
    );

  const tableData: ComplaintListArrayType = debouncedSearchTerm
    ? searchData?.data || []
    : getComplaints?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchData?.pagination?.totalPages || 0
    : getComplaints?.pagination?.totalPages || 0;
  return (
    <>
      <Header subheading="Efficiently Track, Review, and Resolve Employee Complaints!">
        <DateRangePicker
          timeRange={timeRange}
          selectedDate={selectedDate}
          setTimeRange={setTimeRange}
          setDate={handleSetDate}
        />
        <Button variant="outline" asChild>
          <Link
            href={
              user?.roleId === 3
                ? '/manager/manage-complaints/view-complaints'
                : '/hr/manage-complaints/view-complaints'
            }
            className="flex items-center"
          >
            View Complaints
            <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
              {complaintRecords?.records?.pendingCount || 0}
            </span>
          </Link>
        </Button>
      </Header>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ComplaintTrendChart chartData={complaintRecords?.data ?? []} />
        <ComplaintDistributionChart data={complaintRecords?.records} />
      </div>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <ComplaintDataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={hrComplaintColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType={'getComplaints'}
          setFilterValue={setStatus}
          filterValue={status}
        />
      )}
    </>
  );
};

export default HrComplaintTable;
