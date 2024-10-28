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

import DataTableType from '@/libs/validations/data-table-type';

import { DataTablePagination } from './data-table-pagination';
import { AttendanceHistoryListToolbar } from './toolbars/attendance-history-list.toolbar';
import { AttendanceListToolbar } from './toolbars/attendance-list.toolbar';
import { EmployeeListToolbar } from './toolbars/employee-list.toolbar';
import { ManageAnnouncementsToolbar } from './toolbars/hr-manage-announcements.toolbar';
import { HRPayrollListToolbar } from './toolbars/hr-payroll.toolbar';
import { HrPerkListToolbar } from './toolbars/hr-perk-list-toolbar';
import { HrPolicyToolbar } from './toolbars/hr-policy-toolbar';
import { HrEventsListToolbar } from './toolbars/hrEvents-list.toolbar';
import { LeaveHistoryListToolbar } from './toolbars/leave-history-list-toolbar';
import { UnapprovedEmployeeToolbar } from './toolbars/unapproved-employee.toolbar';

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
  toolbarType: string;
  setFilterValue: (value: string[]) => void;
  filterValue: string[];
  toolbar?: string;
}

export function DataTable<TData extends DataTableType, TValue>({
  columns,
  data,
  pagination,
  onSearch,
  searchTerm,
  searchLoading,
  toolbarType,
  setFilterValue,
  filterValue,
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

  const getToolBar = () => {
    switch (toolbarType) {
      case 'hrEventsList':
        return (
          <HrEventsListToolbar
            table={table}
            searchTerm={searchTerm}
            onSearch={onSearch}
            searchLoading={searchLoading}
            setFilterValue={setFilterValue}
            filterValue={filterValue}
          />
        );
      case 'employeeList':
        return (
          <EmployeeListToolbar
            table={table}
            searchTerm={searchTerm}
            onSearch={onSearch}
            searchLoading={searchLoading}
            setFilterValue={setFilterValue}
            filterValue={filterValue}
          />
        );

      case 'unapprovedEmployeeList':
        return (
          <UnapprovedEmployeeToolbar
            table={table}
            searchTerm={searchTerm}
            onSearch={onSearch}
            searchLoading={searchLoading}
            setFilterValue={setFilterValue}
            filterValue={filterValue}
          />
        );

      case 'hrPolicy':
        return (
          <HrPolicyToolbar
            table={table}
            searchTerm={searchTerm}
            onSearch={onSearch}
            searchLoading={searchLoading}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          />
        );

      case 'attendanceHistory':
        return (
          <AttendanceHistoryListToolbar
            table={table}
            searchTerm={searchTerm}
            onSearch={onSearch}
            searchLoading={searchLoading}
          />
        );

      case 'leaveHistory':
        return (
          <LeaveHistoryListToolbar
            table={table}
            searchTerm={searchTerm}
            onSearch={onSearch}
            searchLoading={searchLoading}
          />
        );

      case 'payrollList':
        return (
          <LeaveHistoryListToolbar
            table={table}
            searchTerm={searchTerm}
            onSearch={onSearch}
            searchLoading={searchLoading}
          />
        );

      case 'hrPayrollList':
        return (
          <HRPayrollListToolbar
            table={table}
            searchTerm={searchTerm}
            onSearch={onSearch}
            searchLoading={searchLoading}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          />
        );

      case 'attendanceList':
        return (
          <AttendanceListToolbar
            table={table}
            searchTerm={searchTerm}
            onSearch={onSearch}
            searchLoading={searchLoading}
            setFilterValue={setFilterValue}
            filterValue={filterValue}
          />
        );
      case 'hrPerksList':
        return (
          <HrPerkListToolbar
            table={table}
            searchTerm={searchTerm}
            onSearch={onSearch}
            searchLoading={searchLoading}
            setFilterValue={setFilterValue}
            filterValue={filterValue}
          />
        );
      case 'manage-announcements':
        return (
          <ManageAnnouncementsToolbar
            table={table}
            searchTerm={searchTerm}
            onSearch={onSearch}
            searchLoading={searchLoading}
            setFilterValue={setFilterValue}
            filterValue={filterValue}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {getToolBar()}
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
