'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { employeePerkListColumns } from '@/components/data-table/columns/employee-perk-list.columns';
import { EmployeePerkDataTable } from '@/components/data-table/data-table-employee-perk';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import {
  usePerkListPostQuery,
  usePerkRecordQuery,
} from '@/hooks/employee/usePerkList.hook';
import { PerkListArrayType } from '@/libs/validations/perk';
import { searchPerkList } from '@/services/employee/perk.service';
import { PerkStoreType } from '@/stores/employee/perks';
import { formatedDate } from '@/utils';

import PerkCards from './PerksCards';

import { MessageErrorResponse } from '@/types';
import { User } from '@/types/user.types';

interface PerkTableProps {
  user: User;
  handleAdd: () => void;
}
const PerkTable: FunctionComponent<PerkTableProps> = ({ user, handleAdd }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { perkStore } = useStores() as { perkStore: PerkStoreType };
  const { setRefetchPerkList, refetchPerkList } = perkStore;
  const userId = typeof user?.id === 'string' ? user.id : '';
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
    data: perkPostList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = usePerkListPostQuery(userId, {
    page,
    limit,
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
    status,
  });

  const { data: perkRecords, refetch: refetchRecord } = usePerkRecordQuery(
    userId,
    {
      from: formatedDate(selectedDate?.from),
      to: formatedDate(selectedDate?.to),
    },
  );

  const {
    mutate,
    isPending,
    data: searchPerkData,
  } = useMutation({
    mutationFn: searchPerkList,
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<MessageErrorResponse>;
      toast({
        title: 'Error',
        description:
          axiosError?.response?.data?.message ||
          'Error on fetching search data!',
        variant: 'error',
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

  useEffect(() => {}, [perkPostList, selectedDate]);
  useEffect(() => {}, [perkRecords, selectedDate]);
  useEffect(() => {
    if (refetchPerkList) {
      void (async () => {
        await refetch();
        await refetchRecord();
      })();

      setRefetchPerkList(false);
    }
  }, [refetchPerkList, setRefetchPerkList, refetch, refetchRecord, status]);

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

  const tableData: PerkListArrayType = debouncedSearchTerm
    ? searchPerkData?.data || []
    : perkPostList?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchPerkData?.pagination?.totalPages || 0
    : perkPostList?.pagination?.totalPages || 0;

  const transformData = (perks: PerkListArrayType) => {
    return perks.flatMap(
      perk =>
        perk.incrementApplications?.map(application => ({
          id: perk._id,
          name: perk.name,
          incrementAmount: application.appliedAmount,
          dateApplied: application.dateApplied,
          decisionDate: application.decisionDate,
          hrApproval: application.hrApproval,
          userId: perk.userId,
          requestId: application._id,
          assignedIncrementAmount: perk.assignedIncrementAmount,
          description: perk.description,
        })) || [],
    );
  };

  const flatPerkApplications = transformData(tableData);

  return (
    <>
      <Header subheading="Elevate Your Lifestyle — Discover Perks Designed for You!">
        <DateRangePicker
          timeRange={timeRange}
          selectedDate={selectedDate}
          setTimeRange={setTimeRange}
          setDate={handleSetDate}
        />
        <Button variant="default" onClick={handleAdd}>
          Apply for Perks
        </Button>
      </Header>

      <PerkCards data={perkRecords} />
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={6} rowCount={limit} />
      ) : (
        <EmployeePerkDataTable
          searchLoading={isPending}
          data={flatPerkApplications || []}
          columns={employeePerkListColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType={'perkPostList'}
          setFilterValue={setStatus}
          filterValue={status}
        />
      )}
    </>
  );
};

export default PerkTable;
