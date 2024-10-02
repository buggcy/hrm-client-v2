'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { policyListColumns } from '@/components/data-table/columns/policy-list.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { usePolicyListQuery } from '@/hooks/policies/usePolicyList.hook';
import { PolicyListType } from '@/libs/validations/policies';
import { PolicyStoreType } from '@/stores/employee/policies';

const PolicyTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { policyStore } = useStores() as { policyStore: PolicyStoreType };
  const { setRefetchPolicyList, refetchPolicyList } = policyStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;

  const {
    data: policyList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = usePolicyListQuery({ page, limit });

  useEffect(() => {
    void (async () => {
        await refetch({ page, limit });
      })();
  }, [page, limit, refetch]);

  useEffect(() => {
    if (refetchPolicyList) {
      void (async () => {
        await refetch({ page, limit });
      })();

      setRefetchPolicyList(false);
    }
  }, [refetchPolicyList, page, limit, setRefetchPolicyList, refetch]);

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

  const tableData: PolicyListType = policyList?.data;

  const tablePageCount: number = policyList?.pagination.totalPages;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          data={tableData || []}
          columns={policyListColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
        />
      )}
    </>
  );
};

export default PolicyTable;
