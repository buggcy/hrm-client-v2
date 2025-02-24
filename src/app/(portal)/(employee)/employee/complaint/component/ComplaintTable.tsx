'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';

import { complaintColumns } from '@/components/data-table/columns/complaint.columns';
import { ComplaintDataTable } from '@/components/data-table/data-table-complaint';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useComplaintQuery } from '@/hooks/complaint/useComplaint.hook';
import { ComplaintListArrayType } from '@/libs/validations/complaint';
import { searchComplaints } from '@/services/employee/complaint.service';
import { useAuthStore } from '@/stores/auth';
import { ComplaintStoreType } from '@/stores/employee/complaint';
import { formatedDate } from '@/utils';

import { AddEditComplaintModal } from '../modal/AddEditComplaintModal';

import { MessageErrorResponse } from '@/types';

interface TableProps {}
const ComplaintTable: FunctionComponent<TableProps> = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
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
  const [modal, setModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const {
    data: getComplaints,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useComplaintQuery(
    {
      page,
      limit,
      from: formatedDate(selectedDate?.from),
      to: formatedDate(selectedDate?.to),
      status,
      userId,
    },
    {
      enabled: !!userId,
    },
  );

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
        userId,
        from: formatedDate(selectedDate?.from),
        to: formatedDate(selectedDate?.to),
      });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [
    debouncedSearchTerm,
    refetch,
    mutate,
    page,
    limit,
    status,
    userId,
    selectedDate?.from,
    selectedDate?.to,
  ]);

  useEffect(() => {}, [getComplaints, selectedDate]);

  useEffect(() => {
    if (refetchComplaintList) {
      void (async () => {
        await refetch();
      })();

      setRefetchComplaintList(false);
    }
  }, [refetchComplaintList, setRefetchComplaintList, refetch, status]);

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
        Failed to load Complaint. Please try again later.
      </div>
    );

  const tableData: ComplaintListArrayType = debouncedSearchTerm
    ? searchData?.data || []
    : getComplaints?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchData?.pagination?.totalPages || 0
    : getComplaints?.pagination?.totalPages || 0;
  const handleClose = () => {
    setModal(false);
  };
  const handleAdd = () => {
    setModalType('add');
    setModal(true);
  };

  return (
    <>
      <Header subheading="Your Voice Matters — Share Your Concerns, We're Here to Listen!">
        <DateRangePicker
          timeRange={timeRange}
          selectedDate={selectedDate}
          setTimeRange={setTimeRange}
          setDate={handleSetDate}
        />
        <Button variant="default" size={'sm'} onClick={handleAdd}>
          Register Complaint
        </Button>
      </Header>

      {isLoading || isFetching ? (
        <DataTableLoading columnCount={6} rowCount={limit} />
      ) : (
        <ComplaintDataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={complaintColumns}
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
      <AddEditComplaintModal
        open={modal}
        onCloseChange={handleClose}
        type={modalType}
        userId={userId}
        setRefetchComplaintList={setRefetchComplaintList}
      />
    </>
  );
};

export default ComplaintTable;
