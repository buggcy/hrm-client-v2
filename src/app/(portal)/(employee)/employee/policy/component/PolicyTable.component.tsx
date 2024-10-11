'use client';
import React, { FunctionComponent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { policyListColumns } from '@/components/data-table/columns/policy-list.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { useStores } from '@/providers/Store.Provider';

import { usePolicyListQuery } from '@/hooks/Policies/usePolicyList.hook';
import { PolicyListType } from '@/libs/validations/policies';
import { PolicyStoreType } from '@/stores/employee/Policies';
interface PolicyTableProps {
  category: string;
}

const PolicyTable: FunctionComponent<PolicyTableProps> = ({ category }) => {
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
  } = usePolicyListQuery({ page, limit, category });

  useEffect(() => {
    void (async () => {
      await refetch();
    })();
  }, [page, limit, refetch]);

  useEffect(() => {
    if (refetchPolicyList) {
      void (async () => {
        await refetch();
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

  const tableData: PolicyListType[] = (policyList?.data ||
    []) as PolicyListType[];

  const tablePageCount: number | undefined = policyList?.pagination.totalPages;
  const handleSearchChange = (term: string) => {
    console.log(term);
  };

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
          searchTerm={''}
          onSearch={handleSearchChange}
          filterValue={[]}
          searchLoading={false}
          toolbarType={''}
          setFilterValue={function (value: string[]): void {
            throw new Error('Function not implemented.');
            console.log(value);
          }}
        />
      )}
    </>
  );
};

export default PolicyTable;
