'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { hrAnnouncementColumns } from '@/components/data-table/columns/hr-announcement-columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';

import { useAnnouncementsQuery } from '@/hooks/hr/useManageAnnouncement';
import { AnnouncementApiResponse } from '@/libs/validations/hr-announcement';
import { searchAnnouncements } from '@/services/hr/announcement.service';

import { MessageErrorResponse } from '@/types';

const HrAnnouncementTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [isEnabledFilter, setIsEnabledFilter] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: announcementList,
    isLoading,
    error,
  } = useAnnouncementsQuery({
    page,
    limit,
    Priority: priorityFilter,
    isEnabled: isEnabledFilter,
  });
  const {
    mutate,
    isPending,
    data: searchAnnouncementData,
  } = useMutation({
    mutationFn: searchAnnouncements,
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

  const handleFilterChange = (
    type: 'priority' | 'isEnabled' | 'gender',
    value: string[],
  ) => {
    if (type === 'priority') setPriorityFilter(value);
    else if (type === 'isEnabled') setIsEnabledFilter(value);
  };

  useEffect(() => {
    if (
      debouncedSearchTerm ||
      priorityFilter.length > 0 ||
      isEnabledFilter.length > 0
    ) {
      mutate({
        query: debouncedSearchTerm,
        page,
        limit,
        priority: priorityFilter,
        isEnabled: isEnabledFilter,
      });
    }
  }, [
    debouncedSearchTerm,
    mutate,
    page,
    limit,
    priorityFilter,
    isEnabledFilter,
  ]);

  useEffect(() => {}, [priorityFilter, isEnabledFilter]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handlePaginationChange = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    params.set('limit', newLimit.toString());
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    if (priorityFilter.length > 0)
      params.set('priority', priorityFilter.join(','));
    if (isEnabledFilter.length > 0)
      params.set('status', isEnabledFilter.join(','));
    router.push(`?${params.toString()}`);
  };

  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  const tableData: AnnouncementApiResponse =
    debouncedSearchTerm ||
    priorityFilter.length > 0 ||
    isEnabledFilter.length > 0
      ? searchAnnouncementData || {
          pagination: { page: 0, limit: 0, totalCount: 0, totalPages: 0 },
          data: [],
        }
      : announcementList || {
          pagination: { page: 0, limit: 0, totalCount: 0, totalPages: 0 },
          data: [],
        };

  const tablePageCount: number =
    debouncedSearchTerm ||
    priorityFilter.length > 0 ||
    isEnabledFilter.length > 0
      ? searchAnnouncementData?.pagination?.totalPages || 0
      : announcementList?.pagination?.totalPages || 0;

  return (
    <>
      {isLoading ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isPending}
          data={tableData.data}
          columns={hrAnnouncementColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page,
            limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType="hrAnnouncement"
          setFilterValue={handleFilterChange}
          filterValue={{
            priority: priorityFilter,
            status: isEnabledFilter,
          }}
        />
      )}
    </>
  );
};

export default HrAnnouncementTable;
