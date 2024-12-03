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

import { ComplaintListType } from '@/libs/validations/complaint';

import { DataTablePagination } from './data-table-pagination';
import { ComplaintToolbar } from './toolbars/complaint.toolbar';

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
}

export function ComplaintDataTable<TData extends ComplaintListType, TValue>({
  columns,
  data,
  pagination,
  searchLoading,
  onSearch,
  searchTerm,
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
  });
  const getToolBar = () => {
    switch (toolbarType) {
      case 'getComplaints':
        return (
          <ComplaintToolbar
            table={table}
            searchLoading={searchLoading}
            onSearch={onSearch}
            searchTerm={searchTerm}
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
                  {searchLoading ? 'Finding complaints ...' : 'No results.'}
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
