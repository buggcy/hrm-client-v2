'use client';
import React, { FunctionComponent } from 'react';

import { leaveHistoryListColumns } from '@/components/data-table/columns/leave-history-list.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';

import {
  LeaveHistoryApiResponse,
  LeaveHistoryListType,
} from '@/libs/validations/leave-history';

interface LeaveHistoryTableProps {
  leaveHistoryList: LeaveHistoryApiResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  isPending: boolean;
  searchLeaveHistoryData: LeaveHistoryApiResponse | undefined;
  handleSearchChange: (searchTerm: string) => void;
  handlePaginationChange: (newPage: number, newLimit: number) => void;
  page: number;
  limit: number;
  searchTerm: string;
  debouncedSearchTerm: string;
}

const LeaveHistoryTable: FunctionComponent<LeaveHistoryTableProps> = ({
  leaveHistoryList,
  isLoading,
  isFetching,
  error,
  isPending,
  searchLeaveHistoryData,
  handleSearchChange,
  handlePaginationChange,
  page,
  limit,
  searchTerm,
  debouncedSearchTerm,
}) => {
  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  const tableData: LeaveHistoryListType[] = debouncedSearchTerm
    ? searchLeaveHistoryData?.data || []
    : leaveHistoryList?.data || [];

  const tablePageCount: number | undefined = debouncedSearchTerm
    ? searchLeaveHistoryData?.pagination.totalPages
    : leaveHistoryList?.pagination.totalPages;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={leaveHistoryListColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
        />
      )}
    </>
  );
};

export default LeaveHistoryTable;
