'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { DateRange } from 'react-day-picker';
import { ZodError } from 'zod';

import { hrPerkListColumns } from '@/components/data-table/columns/hr-perk-requests-list.columns';
import { HrPerkDataTable } from '@/components/data-table/data-table-hr-perk';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useHrPerkRequestsTableQuery } from '@/hooks/hrPerksList/useHrPerksList.hook';
import { HrPerkRequestListType } from '@/libs/validations/hr-perks';
import { PerkListStoreType } from '@/stores/hr/perk-list';
import { formatedDate } from '@/utils';

interface PerkTableProps {
  selectedDate?: DateRange;
}
const PerkTable: FunctionComponent<PerkTableProps> = ({ selectedDate }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { perkListStore } = useStores() as { perkListStore: PerkListStoreType };
  const { setRefetchPerkList, refetchPerkList } = perkListStore;
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';

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
  } = useHrPerkRequestsTableQuery({
    page,
    limit,
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
    status,
    query: debouncedSearchTerm,
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
    if (debouncedSearchTerm) {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, refetch, page, limit, status]);

  useEffect(() => {
    if (refetchPerkList) {
      void (async () => {
        await refetch();
      })();

      setRefetchPerkList(false);
    }
  }, [refetchPerkList, setRefetchPerkList, refetch, status]);

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
        Failed to load Perks & Benefits. Please check the data.
      </div>
    );
  const tableData: HrPerkRequestListType[] = perkPostList?.data || [];

  const tablePageCount: number = perkPostList?.pagination?.totalPages || 0;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={6} rowCount={limit} />
      ) : (
        <HrPerkDataTable
          searchLoading={isLoading || isFetching}
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
          toolbarType={'perkPostList'}
          setFilterValue={setStatus}
          filterValue={status}
        />
      )}
    </>
  );
};

export default PerkTable;
