'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { hrPerkListColumns } from '@/components/data-table/columns/hr-perk-list.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import {
  useHrPerkRecordQuery,
  useHrPerksListQuery,
} from '@/hooks/hrPerksList/useHrPerksList.hook';
import { HrPerksListType } from '@/libs/validations/hr-perks';
import { searchHrPerkList } from '@/services/hr/perks-list.service';
import { PerkListStoreType } from '@/stores/hr/perk-list';

import { PerkRequests } from './charts/PerkRequestsStats';
import { PerkStats } from './charts/PerkStats';
import { TopPerks } from './charts/TopPerks';

const HrPerksListTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: hrPerkRecords, refetch: refetchRecord } =
    useHrPerkRecordQuery();
  console.log('records: ', hrPerkRecords);

  const { perkListStore } = useStores() as { perkListStore: PerkListStoreType };
  const { setRefetchPerkList, refetchPerkList } = perkListStore;
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;

  const {
    data: perksList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useHrPerksListQuery({ page, limit, type: typeFilter });

  const {
    mutate,
    isPending,
    data: searchPerkListData,
  } = useMutation({
    mutationFn: ({
      query,
      page,
      limit,
      type,
    }: {
      query: string;
      page: number;
      limit: number;
      type?: string[];
    }) =>
      searchHrPerkList({
        query,
        page,
        limit,
        type,
      }),
    onError: err => {
      toast({
        title: 'Error',
        description: err?.message || 'Error on fetching search data!',
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
      mutate({ query: debouncedSearchTerm, page, limit, type: typeFilter });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, page, limit, refetch, mutate, typeFilter]);

  useEffect(() => {
    if (refetchPerkList) {
      void (async () => {
        await refetch();
        await refetchRecord();
      })();

      setRefetchPerkList(false);
    }
  }, [refetchPerkList, setRefetchPerkList, refetch, refetchRecord]);

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

  const tableData: HrPerksListType[] = debouncedSearchTerm
    ? ((searchPerkListData?.data || []) as HrPerksListType[])
    : ((perksList?.data || []) as HrPerksListType[]);

  const tablePageCount: number | undefined = debouncedSearchTerm
    ? searchPerkListData?.pagination.totalPages
    : perksList?.pagination.totalPages;

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TopPerks chartData={hrPerkRecords?.topAvailed} />
        <PerkStats
          totalPerks={hrPerkRecords?.records?.totalPerks}
          assignedPerks={hrPerkRecords?.records?.totalPerkAssigned}
          approvedPerks={hrPerkRecords?.records?.totalApprovedPerks}
          rejectedPerks={hrPerkRecords?.records?.totalRejectedPerks}
        />
        <PerkRequests chartData={hrPerkRecords?.chartData} />
      </div>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isFetching || isPending}
          data={tableData || []}
          columns={hrPerkListColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType={'hrPerksList'}
          setFilterValue={setTypeFilter}
          filterValue={typeFilter}
        />
      )}
    </>
  );
};

export default HrPerksListTable;
