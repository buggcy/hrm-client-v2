'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { policyColumn } from '@/components/data-table/columns/policy-column';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { useToast } from '@/components/ui/use-toast';

import { useFetchAllPolicies } from '@/hooks/usepolicyQuery';
import {
  PolicyApiResponse,
  PolicyQueryParamsType,
  PolicyType,
} from '@/libs/validations/hr-policy';
import { policyService } from '@/services/hr/policies.service';
import { usePolicyStore } from '@/stores/hr-policies.Store';

interface PolicyTableProps {
  category: string;
}

const PolicyTable: React.FC<PolicyTableProps> = ({ category }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { setPolicies } = usePolicyStore();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: policyList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useFetchAllPolicies({ page, limit, category: category });
  const { mutate: searchPolicies, isPending } = useMutation<
    PolicyApiResponse,
    AxiosError<{ message: string }>,
    PolicyQueryParamsType
  >({
    mutationFn: (params: PolicyQueryParamsType) =>
      policyService.fetchAllPolicies(params),
    onError: err => {
      toast({
        title: 'Error',
        description:
          err.response?.data?.message || 'Error fetching search data!',
        variant: 'destructive',
      });
    },
    onSuccess: data => {
      setPolicies(data.data);
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
    const params: PolicyQueryParamsType = {
      page,
      limit,
      category: debouncedSearchTerm,
    };

    const handleError = (error: unknown) => {
      console.error('Error fetching data:', error);
    };

    if (debouncedSearchTerm) {
      searchPolicies(params);
    } else {
      refetch().catch(handleError);
    }
  }, [debouncedSearchTerm, refetch, searchPolicies, page, limit]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    router.push(
      `/hr/manage-policies?page=${page}&limit=${limit}&search=${term}`,
    );
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        await refetch();
      } catch (error) {
        console.error('Error refetching policies:', error);
      }
    };

    void fetchPolicies();
  }, [category, refetch]);

  if (isLoading) return <DataTableLoading columnCount={4} rowCount={limit} />;

  if (error) {
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  const tableData: PolicyType[] = policyList?.data || [];
  const tablePageCount: number = Math.ceil(
    (policyList?.pagination?.totalCount || 0) / limit,
  );

  return (
    <div>
      <DataTable
        data={tableData}
        columns={policyColumn}
        pagination={{
          pageCount: tablePageCount,
          page,
          limit,
          onPaginationChange: (newPage: number, newLimit: number) => {
            router.push(
              `/hr/manage-policies?page=${newPage}&limit=${newLimit}&search=${searchTerm}`,
            );
          },
        }}
        searchTerm={searchTerm}
        onSearch={handleSearchChange}
        searchLoading={isPending || isFetching}
      />
    </div>
  );
};

export default PolicyTable;
