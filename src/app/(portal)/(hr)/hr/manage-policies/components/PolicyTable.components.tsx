import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { policyColumn } from '@/components/data-table/columns/policy-column';
import { PolicyDataTable } from '@/components/data-table/data-table-hr-policy';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { usePolicyQuery } from '@/hooks/hr/usePolicy.hook';
import { PolicyListArrayType } from '@/libs/validations/hr-policy';
import { searchPolicy } from '@/services/hr/policies.service';
import { PolicyStoreType } from '@/stores/hr/policy';

import { PolicyDialog } from './AddPolicyModal';

import { MessageErrorResponse } from '@/types';

interface PolicyTableProps {}

const PolicyTable: React.FC<PolicyTableProps> = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { policiesStore } = useStores() as { policiesStore: PolicyStoreType };
  const { setRefetchPolicyList, refetchPolicyList } = policiesStore;
  const {
    data: getPolicy,
    isLoading,
    isFetching,
    error,
    refetch,
  } = usePolicyQuery({
    category: '',
    page,
    limit,
  });

  const {
    mutate,
    isPending,
    data: searchData,
  } = useMutation({
    mutationFn: searchPolicy,
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
      mutate({
        query: debouncedSearchTerm,
        page,
        limit,
      });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, refetch, mutate, page, limit]);

  useEffect(() => {}, [getPolicy]);
  useEffect(() => {
    if (refetchPolicyList) {
      void (async () => {
        await refetch();
      })();

      setRefetchPolicyList(false);
    }
  }, [refetchPolicyList, setRefetchPolicyList, refetch]);

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

  const tableData: PolicyListArrayType = debouncedSearchTerm
    ? searchData?.data || []
    : getPolicy?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchData?.pagination?.totalPages || 0
    : getPolicy?.pagination?.totalPages || 0;

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-12">
        <Header subheading="Guiding our team with clarity and respect.">
          <Button onClick={handleDialogOpen} size={'sm'}>
            Add Policy
          </Button>
        </Header>
      </div>

      <div className="mt-6">
        {isLoading || isFetching ? (
          <DataTableLoading columnCount={7} rowCount={limit} />
        ) : (
          <PolicyDataTable
            searchLoading={isPending}
            data={tableData || []}
            columns={policyColumn}
            pagination={{
              pageCount: tablePageCount || 1,
              page: page,
              limit: limit,
              onPaginationChange: handlePaginationChange,
            }}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
            toolbarType={'hrPolicy'}
          />
        )}
      </div>
      <PolicyDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
        setRefetchPolicyList={setRefetchPolicyList}
      />
    </>
  );
};

export default PolicyTable;
