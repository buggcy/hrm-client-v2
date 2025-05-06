'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { taxTypeColumns } from '@/components/data-table/columns/hr-tax.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useTaxQuery } from '@/hooks/hr/useConfigurationList.hook';
import { TaxArrayType } from '@/libs/validations/hr-configuration';
import { searchTax } from '@/services/hr/hrConfiguration.service';
import { useAuthStore } from '@/stores/auth';
import { ConfigurationStoreType } from '@/stores/hr/configuration';

import { AddEditTax } from '../model/AddEditTax';

import { MessageErrorResponse } from '@/types';

interface TableProps {}
const TaxTable: FunctionComponent<TableProps> = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { configurationStore } = useStores() as {
    configurationStore: ConfigurationStoreType;
  };
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const [filterValue, setFilterValue] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [modelType, setModelType] = useState('add');

  const handleClose = () => {
    setModal(false);
  };

  const handleAdd = () => {
    setModelType('add');
    setModal(true);
  };

  const { setRefetchConfigurationList, refetchConfigurationList } =
    configurationStore;
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: getTax,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useTaxQuery({
    page,
    limit,
  });

  const {
    mutate,
    isPending,
    data: searchData,
  } = useMutation({
    mutationFn: searchTax,
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<MessageErrorResponse>;
      toast({
        title: 'Error',
        description:
          axiosError?.response?.data?.error ||
          'An unexpected error occurred. Please try again later or contact support if the issue persists.',
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
  }, [debouncedSearchTerm, refetch, mutate, page, limit]);
  useEffect(() => {}, [getTax]);

  useEffect(() => {
    if (refetchConfigurationList) {
      void (async () => {
        await refetch();
      })();

      setRefetchConfigurationList(false);
    }
  }, [refetchConfigurationList, setRefetchConfigurationList, refetch]);

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

  const tableData: TaxArrayType = debouncedSearchTerm
    ? searchData?.data || []
    : getTax?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchData?.pagination?.totalPages || 0
    : getTax?.pagination?.totalPages || 0;

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="default" size={'sm'} onClick={handleAdd}>
          Add Tax Range
        </Button>
      </div>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={4} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={taxTypeColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType={'getTax'}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />
      )}
      {userId && (
        <AddEditTax
          open={modal}
          onCloseChange={handleClose}
          type={modelType}
          userId={userId}
          setRefetchConfigurationList={setRefetchConfigurationList}
          TypeToEdit={null}
        />
      )}
    </>
  );
};

export default TaxTable;
