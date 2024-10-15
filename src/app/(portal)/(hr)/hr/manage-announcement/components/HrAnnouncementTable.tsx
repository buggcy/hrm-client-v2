import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { BadgePlus } from 'lucide-react';

import { hrAnnouncementColumns } from '@/components/data-table/columns/hr-announcement-columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { useAnnouncementsQuery } from '@/hooks/hr/useManageAnnouncement';
import { AnnouncementApiResponse } from '@/libs/validations/hr-announcement';
import { searchAnnouncements } from '@/services/hr/announcement.service';

import { MessageErrorResponse } from '@/types';

interface AnnouncementTableProps {
  handleDialogOpen: () => void;
}

const HrAnnouncementTable: FunctionComponent<AnnouncementTableProps> = ({
  handleDialogOpen,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);
  const [combinedFilterValue, setCombinedFilterValue] = useState<string[]>([]);

  const {
    data: announcementList,
    isLoading,
    error,
  } = useAnnouncementsQuery({
    page,
    limit,
    Priority: combinedFilterValue.filter(v =>
      ['Low', 'Medium', 'High'].includes(v),
    ),
    isEnabled: combinedFilterValue.filter(v => ['true', 'false'].includes(v)),
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

  const handleFilterChange = useCallback((value: string[]) => {
    setCombinedFilterValue(value);
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm || combinedFilterValue.length > 0) {
      const priorityFilters = combinedFilterValue.filter(v =>
        ['Low', 'Medium', 'High'].includes(v),
      );
      const isEnabledFilters = combinedFilterValue.filter(v =>
        ['true', 'false'].includes(v),
      );

      mutate({
        query: debouncedSearchTerm || ' ',
        page,
        limit,
        priority:
          priorityFilters.length > 0 ? priorityFilters.join(',') : undefined,
        isEnabled:
          isEnabledFilters.length > 0 ? isEnabledFilters.join(',') : undefined,
      });
    }
  }, [debouncedSearchTerm, mutate, page, limit, combinedFilterValue]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handlePaginationChange = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    params.set('limit', newLimit.toString());
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    if (combinedFilterValue.length > 0)
      params.set('filters', combinedFilterValue.join(','));
    router.push(`?${params.toString()}`);
  };

  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  const tableData: AnnouncementApiResponse =
    debouncedSearchTerm || combinedFilterValue.length > 0
      ? searchAnnouncementData || {
          pagination: { page: 0, limit: 0, totalCount: 0, totalPages: 0 },
          data: [],
        }
      : announcementList || {
          pagination: { page: 0, limit: 0, totalCount: 0, totalPages: 0 },
          data: [],
        };

  const tablePageCount: number =
    debouncedSearchTerm || combinedFilterValue.length > 0
      ? searchAnnouncementData?.pagination?.totalPages || 0
      : announcementList?.pagination?.totalPages || 0;

  return (
    <>
      <div className="flex flex-col gap-12">
        <Header subheading="Guiding our team with clarity and respect.">
          <Button variant="default" onClick={handleDialogOpen}>
            <BadgePlus className="mr-2 size-4" /> Add Announcement
          </Button>
        </Header>
      </div>
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
          filterValue={combinedFilterValue}
        />
      )}
    </>
  );
};

export default HrAnnouncementTable;
