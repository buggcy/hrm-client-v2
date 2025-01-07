'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { employeePerkListColumns } from '@/components/data-table/columns/employee-perk-list.columns';
import { EmployeePerkDataTable } from '@/components/data-table/data-table-employee-perk';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import { useStores } from '@/providers/Store.Provider';

import {
  usePerkListPostQuery,
  usePerkRecordQuery,
} from '@/hooks/employee/usePerkList.hook';
import { PerkListArrayType } from '@/libs/validations/perk';
import { PerkStoreType } from '@/stores/employee/perks';
import { formatedDate } from '@/utils';

import PerkCards from './PerksCards';

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
    query: debouncedSearchTerm,
  });

  const { data: perkRecords, refetch: refetchRecord } = usePerkRecordQuery(
    userId,
    {
      from: formatedDate(selectedDate?.from),
      to: formatedDate(selectedDate?.to),
    },
  );

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
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, refetch, page, limit, status]);

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

  const tableData: PerkListArrayType = perkPostList?.data || [];

  const tablePageCount: number = perkPostList?.pagination?.totalPages || 0;

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
          searchLoading={isLoading || isFetching}
          data={tableData || []}
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
