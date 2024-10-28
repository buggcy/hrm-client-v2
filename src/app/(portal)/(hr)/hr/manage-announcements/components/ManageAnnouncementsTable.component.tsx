'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';

import { hrManageAnnouncementColumns } from '@/components/data-table/columns/hr-manage-announcements.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useManageAnnouncementQuery } from '@/hooks/hr/useManageAnnouncements.hook';
import { AnnouncementType } from '@/libs/validations/hr-announcements';
import { searchAnnouncements } from '@/services/hr/manage-announcements.service';
import { AnnouncementsStoreType } from '@/stores/hr/announcements';

interface ManageAnnouncementsTableProps {
  dates?: DateRange;
}

const ManageAnnouncementTable: FunctionComponent<
  ManageAnnouncementsTableProps
> = ({ dates }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { manageAnnouncementsStore } = useStores() as {
    manageAnnouncementsStore: AnnouncementsStoreType;
  };
  const { refetchAnnouncements, setRefetchAnnouncements } =
    manageAnnouncementsStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: announcements,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useManageAnnouncementQuery({
    page,
    limit,
    from: dates?.from?.toISOString(),
    to: dates?.to?.toISOString(),
    Priority: priorityFilter,
  });

  const {
    mutate,
    isPending,
    data: searchAttendanceListData,
  } = useMutation({
    mutationFn: ({
      query,
      page,
      limit,
      Status,
    }: {
      query: string;
      page: number;
      limit: number;
      Status: string[];
    }) =>
      searchAnnouncements({
        query,
        page,
        limit,
        from: dates?.from?.toISOString(),
        to: dates?.to?.toISOString(),
        Priority: Status,
      }),
    onError: err => {
      toast({
        title: 'Error',
        description: err?.message || 'Error on fetching search data!',
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
        Status: priorityFilter,
      });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, page, limit, refetch, mutate, priorityFilter]);

  useEffect(() => {
    if (refetchAnnouncements) {
      void (async () => {
        await refetch();
      })();

      setRefetchAnnouncements(false);
    }
  }, [refetchAnnouncements, setRefetchAnnouncements, refetch]);

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

  const tableData: AnnouncementType[] = debouncedSearchTerm
    ? searchAttendanceListData?.data || []
    : announcements?.data || [];

  const tablePageCount: number | undefined = debouncedSearchTerm
    ? searchAttendanceListData?.pagination.totalPages
    : announcements?.pagination.totalPages;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={hrManageAnnouncementColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType="manage-announcements"
          setFilterValue={setPriorityFilter}
          filterValue={priorityFilter}
        />
      )}
    </>
  );
};

export default ManageAnnouncementTable;
