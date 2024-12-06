'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ProjectColumns } from '@/components/data-table/columns/project.columns';
import { ProjectDataTable } from '@/components/data-table/data-table-project';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import {
  useProjectQuery,
  useProjectStatisticsQuery,
} from '@/hooks/hr/useProjectDepartment.hook';
import { ProjectListArrayType } from '@/libs/validations/project-department';
import { searchProjects } from '@/services/hr/project-department.service';
import { useAuthStore } from '@/stores/auth';
import { ProjectStoreType } from '@/stores/hr/project-department';
import { formatedDate } from '@/utils';

import { ProjectActiveRecordChart } from './Charts/ProjectActiveChart';
import { ProjectBarChat } from './Charts/ProjectBarChart';
import { ProjectPieChart } from './Charts/ProjectPieChart';
import AddEditProjectModal from './Modal/AddEditProjectModal';

import { MessageErrorResponse } from '@/types';

const ProjectTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const { projectStore } = useStores() as { projectStore: ProjectStoreType };
  const { setRefetchProjectList, refetchProjectList } = projectStore;
  const [modal, setModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);
  const [status, setStatus] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<string[]>([]);

  const {
    data: getProjects,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useProjectQuery({
    page,
    limit,
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
    status,
    isActive,
  });

  const { data: projectRecords, refetch: refetchRecord } =
    useProjectStatisticsQuery({
      from: formatedDate(selectedDate?.from),
      to: formatedDate(selectedDate?.to),
    });

  const {
    mutate,
    isPending,
    data: searchData,
  } = useMutation({
    mutationFn: searchProjects,
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
        from: formatedDate(selectedDate?.from),
        to: formatedDate(selectedDate?.to),
      });
    } else {
      void (async () => {
        await refetch();
        await refetchRecord();
      })();
    }
  }, [
    debouncedSearchTerm,
    refetch,
    mutate,
    page,
    limit,
    status,
    isActive,
    refetchRecord,
    selectedDate?.from,
    selectedDate?.to,
  ]);

  useEffect(() => {}, [getProjects, selectedDate]);
  useEffect(() => {}, [projectRecords, selectedDate]);
  useEffect(() => {
    if (refetchProjectList) {
      void (async () => {
        await refetch();
        await refetchRecord();
      })();

      setRefetchProjectList(false);
    }
  }, [
    refetchProjectList,
    setRefetchProjectList,
    refetch,
    status,
    isActive,
    refetchRecord,
  ]);

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

  const tableData: ProjectListArrayType = debouncedSearchTerm
    ? searchData?.data || []
    : getProjects?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchData?.pagination?.totalPages || 0
    : getProjects?.pagination?.totalPages || 0;
  const handleClose = () => {
    setModal(false);
  };
  const handleAdd = () => {
    setModalType('add');
    setModal(true);
  };
  return (
    <>
      <Header subheading="Efficiently Add and Oversee Your Projects from Start to Finish!">
        <DateRangePicker
          timeRange={timeRange}
          selectedDate={selectedDate}
          setTimeRange={setTimeRange}
          setDate={handleSetDate}
        />
        <Button size={'sm'} onClick={handleAdd}>
          Add Project
        </Button>
      </Header>

      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="col-span-1 md:col-span-6 lg:col-span-6">
          <ProjectBarChat chartData={projectRecords?.data ?? []} />
        </div>
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          {' '}
          <ProjectPieChart
            activeCount={projectRecords?.records?.activeCount}
            inactiveCount={projectRecords?.records?.inactiveCount}
          />
        </div>

        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          <ProjectActiveRecordChart
            pendingCount={projectRecords?.statistics?.pendingCount}
            completedCount={projectRecords?.statistics?.completedCount}
            inProgressCount={projectRecords?.statistics?.inProgressCount}
            cancelledCount={projectRecords?.statistics?.cancelledCount}
            notStartedCount={projectRecords?.statistics?.notStartedCount}
            overdueCount={projectRecords?.statistics?.overdueCount}
            totalCount={projectRecords?.statistics?.totalCount}
          />
        </div>
      </div>

      <div className="mt-6">
        {isLoading || isFetching ? (
          <DataTableLoading columnCount={7} rowCount={limit} />
        ) : (
          <ProjectDataTable
            searchLoading={isPending}
            data={tableData || []}
            columns={ProjectColumns}
            pagination={{
              pageCount: tablePageCount || 1,
              page: page,
              limit: limit,
              onPaginationChange: handlePaginationChange,
            }}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
            toolbarType={'getProjects'}
            setFilterValue={setStatus}
            filterValue={status}
            setActiveFilterValue={setIsActive}
            activeFilterValue={isActive}
          />
        )}
      </div>
      <AddEditProjectModal
        open={modal}
        onCloseChange={handleClose}
        userId={userId}
        type={modalType}
        setRefetchProjectList={setRefetchProjectList}
      />
    </>
  );
};

export default ProjectTable;
