'use client';

import * as React from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { AttendanceHistoryListType } from '@/libs/validations/attendance-history';
import {
  EmployeeListType,
  EmployeePayrollListType,
} from '@/libs/validations/employee';
import { LeaveHistoryListType } from '@/libs/validations/leave-history';
import { PolicyListType } from '@/libs/validations/policies';

import { DataTablePagination } from './data-table-pagination';
import { AttendanceHistoryListToolbar } from './toolbars/attendance-history-list.toolbar';
import { EmployeeListToolbar } from './toolbars/employee-list.toolbar';
import { LeaveHistoryListToolbar } from './toolbars/leave-history-list-toolbar';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: {
    pageCount: number;
    page: number;
    limit: number;
    onPaginationChange: (page: number, limit: number) => void;
  };
  searchTerm: string;
  onSearch: (term: string) => void;
  searchLoading: boolean;
}

export function DataTable<
  TData extends
    | EmployeePayrollListType
    | EmployeeListType
    | AttendanceHistoryListType
    | LeaveHistoryListType
    | PolicyListType,
  TValue,
>({
  columns,
  data,
  pagination,
  onSearch,
  searchTerm,
  searchLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    pageCount: pagination.pageCount,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
  });

  const dataType = data[0]?.type;
  return (
    <div className="space-y-4">
      {dataType === 'employee' ? (
        <EmployeeListToolbar
          table={table}
          searchTerm={searchTerm}
          onSearch={onSearch}
          searchLoading={searchLoading}
        />
      ) : dataType === 'attendanceHistory' ? (
        <AttendanceHistoryListToolbar
          table={table}
          searchTerm={searchTerm}
          onSearch={onSearch}
          searchLoading={searchLoading}
        />
      ) : (
        <LeaveHistoryListToolbar
          table={table}
          searchTerm={searchTerm}
          onSearch={onSearch}
          searchLoading={searchLoading}
        />
      )}
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {searchLoading ? 'Finding Results ...' : 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        table={table}
        page={pagination.page}
        limit={pagination.limit}
        onPaginationChange={pagination.onPaginationChange}
      />
    </div>
  );
}
