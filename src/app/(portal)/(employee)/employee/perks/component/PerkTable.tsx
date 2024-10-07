'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { employeePerkListColumns } from '@/components/data-table/columns/employee-perk-list.columns';
import { EmployeePerkDataTable } from '@/components/data-table/data-table-employee-perk';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { usePerkListQuery } from '@/hooks/employee/usePerkList.hook';
import { PerkListArrayType } from '@/libs/validations/perk';
import { searchPerkList } from '@/services/employee/perk.service';
import { PerkStoreType } from '@/stores/employee/perks';

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

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: perkList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = usePerkListQuery(userId, { page, limit });

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
  }, [debouncedSearchTerm, refetch, mutate, page, limit]);

  useEffect(() => {}, [perkList]);

  useEffect(() => {
    if (refetchPerkList) {
      void (async () => {
        await refetch();
      })();

      setRefetchPerkList(false);
    }
  }, [refetchPerkList, setRefetchPerkList, refetch]);
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
    : perkList?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchPerkData?.pagination?.totalPages || 0
    : perkList?.pagination?.totalPages || 0;

  return (
    <>
      <div className="flex w-full flex-col items-center justify-end gap-y-4 md:flex-row">
        <Button variant="default" onClick={handleAdd}>
          Apply for Perks
        </Button>
      </div>

      {isLoading || isFetching ? (
        <DataTableLoading columnCount={6} rowCount={limit} />
      ) : (
        <EmployeePerkDataTable
          searchLoading={isPending}
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
        />
      )}
    </>
  );
};

export default PerkTable;
