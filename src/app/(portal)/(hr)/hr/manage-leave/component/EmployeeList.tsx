'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { hrManageLeaveColumns } from '@/components/data-table/columns/extra-leave.columns';
import { ExtraLeaveDataTable } from '@/components/data-table/data-table-extra-leave';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useHrPerksEmpoyeeQuery } from '@/hooks/hrPerksList/useHrPerksList.hook';
import {
  useAllowLeaveListQuery,
  useExtraLeaveRequestQuery,
} from '@/hooks/manageLeave/useLeaveList.hook';
import { ExtraLeaveArrayType } from '@/libs/validations/manage-leave';
import { searchLeaveList } from '@/services/hr/manage.leave.service';
import { ManageLeaveStoreType } from '@/stores/hr/leave';

import { AddExtraLeaveModal } from './AddExtraLeave';
import UpdateLeaveForm from './UpdateLeaveForm';

import { MessageErrorResponse } from '@/types';
import { HrPerksGetEmployees } from '@/types/hr-perks-list.types';

const EmployeeList = () => {
  const { data } = useHrPerksEmpoyeeQuery();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [selectedEmployeeData, setSelectedEmployeeData] =
    useState<HrPerksGetEmployees>();

  const handleEmployeeChange = (value: string) => {
    setSelectedEmployeeId(value);
    setSelectedEmployeeData(data?.data.find(employee => employee.id === value));
  };

  const { data: leaveData } = useAllowLeaveListQuery(selectedEmployeeId, {
    enabled: !!selectedEmployeeId,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const { manageLeaveStore } = useStores() as {
    manageLeaveStore: ManageLeaveStoreType;
  };
  const { setRefetchManageLeaveList, refetchManageLeaveList } =
    manageLeaveStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);
  const {
    data: getExtraLeave,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useExtraLeaveRequestQuery(
    selectedEmployeeId,
    {
      page,
      limit,
    },
    {
      enabled: !!selectedEmployeeId,
    },
  );

  const {
    mutate,
    isPending,
    data: searchLeaveListData,
  } = useMutation({
    mutationFn: searchLeaveList,
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
    if (debouncedSearchTerm && selectedEmployeeId) {
      mutate({
        id: selectedEmployeeId,
        query: debouncedSearchTerm,
        page,
        limit,
      });
    } else if (selectedEmployeeId) {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, mutate, page, limit, selectedEmployeeId, refetch]);

  useEffect(() => {}, [getExtraLeave]);
  useEffect(() => {
    if (refetchManageLeaveList && selectedEmployeeId) {
      void (async () => {
        await refetch();
      })();
      setRefetchManageLeaveList(false);
    }
  }, [
    refetchManageLeaveList,
    setRefetchManageLeaveList,
    refetch,
    selectedEmployeeId,
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

  const tableData: ExtraLeaveArrayType = debouncedSearchTerm
    ? searchLeaveListData?.data || []
    : getExtraLeave?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchLeaveListData?.pagination?.totalPages || 0
    : getExtraLeave?.pagination?.totalPages || 0;

  const handleClose = () => {
    setModal(false);
  };
  const handleAdd = () => {
    setModalType('add');
    setModal(true);
  };

  return (
    <>
      <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row">
        <Select onValueChange={handleEmployeeChange}>
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 md:max-w-[64%]">
            <SelectTrigger className="h-[50px] w-full p-4">
              {selectedEmployeeId ? (
                <div className="flex items-center gap-1 sm:gap-4">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={selectedEmployeeData?.avatar || ''}
                      alt={`${selectedEmployeeData?.avatar}`}
                    />
                    <AvatarFallback className="uppercase">
                      {selectedEmployeeData?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <SelectValue>
                      <p className="text-sm">{selectedEmployeeData?.name}</p>
                    </SelectValue>
                    <p className="text-xs text-muted-foreground">
                      {selectedEmployeeData?.email}
                    </p>
                  </div>
                </div>
              ) : (
                <SelectValue placeholder="Select Employee" />
              )}
            </SelectTrigger>
            <div className="hidden h-0 w-full opacity-0 sm:block"></div>
            <div className="hidden h-0 w-full opacity-0 sm:block"></div>
          </div>
          <SelectContent className="w-fit">
            <SelectGroup>
              <SelectLabel>Select Employee</SelectLabel>
              {data?.data.map(employee => (
                <SelectItem key={employee.id} value={employee.id}>
                  <div className="flex items-center gap-1 sm:gap-4">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={employee.avatar || ''}
                        alt={`${employee.avatar}`}
                      />
                      <AvatarFallback className="uppercase">
                        {employee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start">
                      <p className="text-sm">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {employee.email}
                      </p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div>
          {' '}
          {selectedEmployeeId && (
            <>
              {leaveData && (
                <div className="mt-4 flex justify-end">
                  <Button size={'sm'} onClick={handleAdd}>
                    Add Extra Leave
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedEmployeeId && (
        <>
          <div className="mt-7 flex flex-wrap">
            <div className="w-full pr-0 md:w-9/12 md:pr-7">
              {isLoading || isFetching ? (
                <DataTableLoading columnCount={4} rowCount={limit} />
              ) : (
                <ExtraLeaveDataTable
                  searchLoading={isPending}
                  data={tableData || []}
                  columns={hrManageLeaveColumns}
                  pagination={{
                    pageCount: tablePageCount || 1,
                    page: page,
                    limit: limit,
                    onPaginationChange: handlePaginationChange,
                  }}
                  onSearch={handleSearchChange}
                  searchTerm={searchTerm}
                  toolbarType={'getExtraLeave'}
                />
              )}
            </div>
            <div className="w-full pt-0 md:w-3/12 md:pt-7">
              {leaveData && (
                <div className="mt-5">
                  <UpdateLeaveForm
                    selectedEmployeeId={selectedEmployeeId}
                    CasualLeaves={leaveData?.allowedCasualLeaves}
                    SickLeaves={leaveData?.allowedSickLeaves}
                    AnnualLeaves={leaveData?.annualLeavesAllowed}
                    setRefetchManageLeaveList={setRefetchManageLeaveList}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <AddExtraLeaveModal
        open={modal}
        onCloseChange={handleClose}
        selectedEmployeeId={selectedEmployeeId}
        type={modalType}
        setRefetchManageLeaveList={setRefetchManageLeaveList}
        leaveToEdit={null}
      />
    </>
  );
};

export default EmployeeList;
